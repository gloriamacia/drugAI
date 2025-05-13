# lambdas/ml_inference/ml_inference_handler.py
import json, os
from datetime import datetime, timezone, timedelta
import boto3
from boto3.dynamodb.conditions import Key

TABLE     = boto3.resource("dynamodb").Table(os.environ["TABLE_NAME"])
FREE_QUOTA = int(os.environ["FREE_QUOTA"])
PRO_QUOTA  = int(os.environ["PRO_QUOTA"])

def _month_key():
    return datetime.now(timezone.utc).strftime("%Y-%m")

def lambda_handler(event, _ctx):
    claims  = event["requestContext"]["authorizer"]["jwt"]["claims"]
    user_id = claims["sub"]

    # fetch profile
    prof = TABLE.get_item(Key={"PK": f"USER#{user_id}", "SK": "PROFILE"}).get("Item", {})
    plan  = prof.get("plan", "free")
    quota = prof.get("quota", FREE_QUOTA)

    # usage counter
    month_key = _month_key()
    resp      = TABLE.get_item(Key={"PK": f"USAGE#{user_id}", "SK": month_key})
    used      = int(resp.get("Item", {}).get("count", 0))

    if plan == "free" and used >= quota:
        return {
            "statusCode": 402,
            "body": json.dumps({"error": "Monthly quota exceeded"}),
        }

    # do your inference
    prompt = json.loads(event.get("body") or "{}").get("prompt", "")
    result = f"Echo: {prompt}"

    # compute TTL two years from now
    now    = datetime.now(timezone.utc)
    ttl_ts = int((now + timedelta(days=365*2)).timestamp())

    # increment count & set TTL if first time this month
    TABLE.update_item(
        Key={"PK": f"USAGE#{user_id}", "SK": month_key},
        UpdateExpression=(
            "SET #c = if_not_exists(#c, :zero) + :one, #t = if_not_exists(#t, :zero) + :ttl_val"
        ),
        ExpressionAttributeNames={
            "#c": "count",
            "#t": "ttl",
        },
        ExpressionAttributeValues={
            ":zero": 0,
            ":one": 1,
            ":ttl_val": ttl_ts,
        },
    )

    return {
        "statusCode": 200,
        "headers": {"Content-Type": "application/json"},
        "body": json.dumps({"result": result, "usage": used + 1}),
    }
