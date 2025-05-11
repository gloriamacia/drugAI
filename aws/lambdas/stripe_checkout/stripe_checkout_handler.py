# lambdas/stripe_checkout/stripe_checkout_handler.py
import json
import os
import boto3
import stripe

# cold-start: fetch Stripe API key
secrets = boto3.client("secretsmanager")
stripe.api_key = secrets.get_secret_value(
    SecretId=os.environ["STRIPE_SECRET_ARN"]
)["SecretString"]

def lambda_handler(event, _ctx):
    # 1) extract Clerk userId from JWT
    claims  = event["requestContext"]["authorizer"]["jwt"]["claims"]
    user_id = claims["sub"]

    # 2) parse request body for email
    body  = json.loads(event.get("body") or "{}")
    email = body.get("email")
    if not email:
        return {
            "statusCode": 400,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({"error": "Missing user email"}),
        }

    # 3) find or create the Stripe Customer
    existing = stripe.Customer.list(email=email, limit=1).data
    if existing:
        customer = existing[0]
    else:
        customer = stripe.Customer.create(
            email=email,
            metadata={"clerkUserId": user_id}
        )

    # 4) check if they have any ACTIVE subscriptions
    subs = stripe.Subscription.list(
        customer=customer.id,
        status="active",
        limit=1
    ).data

    if subs:
        # they already have an active subscription → send to dashboard
        return {
            "statusCode": 200,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({"redirectUrl": os.environ["DASHBOARD_URL"]}),
        }

    # 5) no active sub (either cancelled or never) → launch Checkout
    session = stripe.checkout.Session.create(
        mode="subscription",
        payment_method_types=["card"],
        line_items=[{"price": os.environ["STRIPE_PRICE_ID"], "quantity": 1}],
        customer=customer.id,
        subscription_data={"metadata": {"clerkUserId": user_id}},
        success_url=os.environ["SUCCESS_URL"],
        cancel_url=os.environ["CANCEL_URL"],
    )

    return {
        "statusCode": 200,
        "headers": {"Content-Type": "application/json"},
        "body": json.dumps({"url": session.url}),
    }
