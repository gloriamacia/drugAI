# lambdas/stripe_checkout/stripe_checkout_handler.py
import json, os, boto3, stripe

SM = boto3.client("secretsmanager")
stripe.api_key = SM.get_secret_value(
    SecretId=os.environ["STRIPE_SECRET_ARN"]
)["SecretString"]

PRO_PRICE_ID = os.environ["STRIPE_PRICE_ID"]

def find_customer_by_clerk(clerk_id: str):
    """
    Use Stripe's /v1/customers/search endpoint to find a customer
    whose metadata['clerkUserId'] equals clerk_id.
    """
    try:
        res = stripe.Customer.search(
            query=f"metadata['clerkUserId']:'{clerk_id}'",
            limit=1
        )
        if res.data:
            return res.data[0]
    except stripe.error.InvalidRequestError:
        # Search API might be disabled on very old Stripe accounts; fall back
        pass
    return None

def lambda_handler(event, _ctx):
    # 1) Clerk identity
    claims   = event["requestContext"]["authorizer"]["jwt"]["claims"]
    clerk_id = claims["sub"]

    # 2) email from the request body
    body  = json.loads(event.get("body") or "{}")
    email = body.get("email")
    if not email:
        return {"statusCode":400,"body":json.dumps({"error":"Missing email"})}

    # 3) find customer by clerkUserId in metadata
    customer = find_customer_by_clerk(clerk_id)

    # 4) if not found, fall back to email lookup
    if not customer:
        matches = stripe.Customer.list(email=email, limit=1).data
        customer = matches[0] if matches else None

    # 5) create customer if still none
    if not customer:
        customer = stripe.Customer.create(
            email=email,
            metadata={"clerkUserId": clerk_id}
        )
    else:
        # ensure metadata has clerkUserId (legacy customers)
        if customer.metadata.get("clerkUserId") != clerk_id:
            stripe.Customer.modify(customer.id, metadata={"clerkUserId": clerk_id})

    # 6) look for an active Pro subscription on this customer
    subs = stripe.Subscription.list(
        customer=customer.id,
        price=PRO_PRICE_ID,
        status="active",
        limit=1
    ).data

    if subs:
        # already Pro → straight back to dashboard
        return {
            "statusCode": 200,
            "headers": {"Content-Type":"application/json"},
            "body": json.dumps({"redirectUrl": os.environ["DASHBOARD_URL"]})
        }

    # 7) otherwise start Checkout
    sess = stripe.checkout.Session.create(
        mode="subscription",
        payment_method_types=["card"],
        line_items=[{"price": PRO_PRICE_ID, "quantity": 1}],
        customer=customer.id,
        subscription_data={"metadata":{"clerkUserId": clerk_id}},
        success_url=os.environ["SUCCESS_URL"],
        cancel_url=os.environ["CANCEL_URL"],
    )

    return {
        "statusCode": 200,
        "headers": {"Content-Type":"application/json"},
        "body": json.dumps({"url": sess.url})
    }
