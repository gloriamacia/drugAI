# lambdas/stripe_webhook/stripe_webhook_handler.py
import json
import os
import boto3
import stripe
from datetime import datetime, timezone

# Dynamo & Secrets clients
TABLE = boto3.resource("dynamodb").Table(os.environ["TABLE_NAME"])
SM    = boto3.client("secretsmanager")

# Load Stripe secrets
STRIPE_SECRET    = SM.get_secret_value(SecretId=os.environ["STRIPE_SECRET_ARN"])["SecretString"]
STRIPE_WH_SECRET = SM.get_secret_value(SecretId=os.environ["STRIPE_WEBHOOK_SECRET_ARN"])["SecretString"]
stripe.api_key   = STRIPE_SECRET

FREE_QUOTA = int(os.environ["FREE_QUOTA"])
PRO_QUOTA  = int(os.environ["PRO_QUOTA"])

def update_profile(user_id: str, plan: str, stripe_cust_id: str | None = None):
    """
    If stripe_cust_id is not None, include it in the update.
    Otherwise leave any existing stripeCustomerId untouched.
    """
    updated_at = datetime.now(timezone.utc).isoformat()

    # Base parts of the update
    expr_names  = {"#p": "plan", "#q": "quota", "#u": "updated"}
    expr_vals   = {
        ":p": plan,
        ":q": PRO_QUOTA if plan == "pro" else FREE_QUOTA,
        ":u": updated_at,
    }
    update_expr = "SET #p = :p, #q = :q, #u = :u"

    # Only overwrite stripeCustomerId when we have a new value
    if stripe_cust_id:
        expr_names["#s"] = "stripeCustomerId"
        expr_vals[":s"]   = stripe_cust_id
        update_expr += ", #s = :s"

    TABLE.update_item(
        Key={"PK": f"USER#{user_id}", "SK": "PROFILE"},
        UpdateExpression=update_expr,
        ExpressionAttributeNames=expr_names,
        ExpressionAttributeValues=expr_vals,
    )

def lambda_handler(event, _ctx):
    payload = event.get("body", "")
    sig_hdr = event["headers"].get("stripe-signature", "")

    # Verify webhook signature
    try:
        evt = stripe.Webhook.construct_event(payload, sig_hdr, STRIPE_WH_SECRET)
    except stripe.error.SignatureVerificationError:
        return {"statusCode": 400}

    typ  = evt["type"]
    obj  = evt["data"]["object"]
    meta = obj.get("metadata", {})

    # On payment/renewal events → set Pro and record stripeCustomerId
    if typ in (
        "checkout.session.completed",
        "invoice.payment_succeeded",
        "customer.subscription.created",
        "customer.subscription.updated",
    ):
        clerk_id    = meta.get("clerkUserId")
        stripe_cust = obj.get("customer") or meta.get("customer")
        if clerk_id and stripe_cust:
            update_profile(clerk_id, "pro", stripe_cust)

    # On subscription deletion → back to Free, preserve stripeCustomerId
    elif typ == "customer.subscription.deleted":
        clerk_id = meta.get("clerkUserId")
        if clerk_id:
            update_profile(clerk_id, "free", None)

    return {"statusCode": 200, "body": "ok"}
