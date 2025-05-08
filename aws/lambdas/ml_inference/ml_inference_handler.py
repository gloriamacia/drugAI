import json, os
from datetime import datetime, timezone

import boto3
from boto3.dynamodb.conditions import Key

TABLE = boto3.resource("dynamodb").Table(os.environ["TABLE_NAME"])
FREE_QUOTA = int(os.environ["FREE_QUOTA"])

def _month_key():
    return datetime.now(timezone.utc).strftime("%Y-%m")

def lambda_handler(event, _ctx):
    # 1) Extract user identity from JWT
    claims = event["requestContext"]["authorizer"]["jwt"]["claims"]
    user_id = claims["sub"]

    # 2) Fetch plan profile (if missing = FREE)
    prof_key = {"PK": f"USER#{user_id}", "SK": "PROFILE"}
    prof = TABLE.get_item(Key=prof_key).get("Item") or {
        "plan": "free", "quota": FREE_QUOTA
    }
    plan, quota = prof["plan"], prof.get("quota", FREE_QUOTA)

    # 3) Current month usage
    usage_key = {"PK": f"USAGE#{user_id}", "SK": _month_key()}
    usage = TABLE.get_item(Key=usage_key).get("Item") or {"count": 0}
    used = int(usage["count"])


    # 4) Quota check
    if plan == "free" and used >= quota:
        return {
            "statusCode": 402,
            "body": json.dumps({"error": "Monthly quota exhausted"}),
        }

    # 5) *** Your real model inference goes here ***
    body = json.loads(event.get("body") or "{}")
    prompt = body.get("prompt", "…")
    result = f"Echo: {prompt}"

    # 6) Atomic counter increment
    TABLE.update_item(
        Key=usage_key,
        UpdateExpression="SET #c = if_not_exists(#c, :zero) + :one",
        ExpressionAttributeNames={"#c": "count"},
        ExpressionAttributeValues={":zero": 0, ":one": 1},
    )

    return {
        "statusCode": 200,
        "headers": {"Content-Type": "application/json"},
        "body": json.dumps({"result": result, "usage": used + 1}),
    }
