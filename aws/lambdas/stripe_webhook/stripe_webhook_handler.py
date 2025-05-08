import json, os, boto3, stripe
from datetime import datetime, timezone

SM = boto3.client("secretsmanager")
TABLE = boto3.resource("dynamodb").Table(os.environ["TABLE_NAME"])

STRIPE_SECRET = SM.get_secret_value(
    SecretId=os.environ["STRIPE_SECRET_ARN"]
)["SecretString"]
STRIPE_WEBHOOK_SECRET = SM.get_secret_value(
    SecretId=os.environ["STRIPE_WEBHOOK_SECRET_ARN"]
)["SecretString"]

stripe.api_key = STRIPE_SECRET
PRO_PRICE = os.environ["STRIPE_PRICE_ID"]
FREE_QUOTA = int(os.environ["FREE_QUOTA"])

def update_profile(user_id: str, plan: str):
    item = {
        "PK": f"USER#{user_id}",
        "SK": "PROFILE",
        "plan": plan,
        "quota": None if plan == "pro" else FREE_QUOTA,
        "updated": datetime.utcnow().isoformat(timespec="seconds"),
    }
    TABLE.put_item(Item=item)

def lambda_handler(event, _ctx):
    sig = event["headers"].get("stripe-signature", "")
    body = event["body"] or ""

    try:
        stripe_event = stripe.Webhook.construct_event(
            payload=body, sig_header=sig, secret=STRIPE_WEBHOOK_SECRET
        )
    except Exception as exc:
        return {"statusCode": 400, "body": str(exc)}

    etype = stripe_event["type"]

    # We map both checkout.session.completed and invoice.paid to Pro
    if etype in ("checkout.session.completed", "invoice.payment_succeeded"):
        sess = stripe_event["data"]["object"]
        # we store Clerk user‑id in session metadata at checkout
        user_id = sess["metadata"].get("clerk_user_id")
        if user_id:
            update_profile(user_id, "pro")

    # Handle cancellation
    if etype == "customer.subscription.deleted":
        sub = stripe_event["data"]["object"]
        user_id = sub["metadata"].get("clerk_user_id")
        if user_id:
            update_profile(user_id, "free")

    return {"statusCode": 200, "body": "ok"}
