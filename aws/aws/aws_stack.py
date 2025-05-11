from pathlib import Path
from aws_cdk import (
    Stack, Duration, BundlingOptions, RemovalPolicy,
    CfnOutput,
    SecretValue,
    aws_lambda as _lambda,
    aws_apigatewayv2 as apigw,
    aws_apigatewayv2_integrations as integrations,
    aws_apigatewayv2_authorizers as authorizers,
    aws_dynamodb as ddb,
    aws_secretsmanager as secrets,
)
from constructs import Construct

ROOT = Path(__file__).parents[1]

class DrugAIStack(Stack):
    def __init__(self, scope: Construct, id_: str, **kwargs):
        super().__init__(scope, id_, **kwargs)

        # ────────── Config ──────────
        clerk_issuer   = "https://finer-molly-35.clerk.accounts.dev"
        clerk_audience = ["pk_test_ZmluZXItbW9sbHktMzUuY2xlcmsuYWNjb3VudHMuZGV2JA"]
        free_quota     = "5"
        pro_quota      = "100"
        stripe_price   = "price_1RLgj6PMlnECffWD9uiVzrSJ"

        # ────────── Secrets ──────────

        # Create new Secrets in Secrets Manager
        stripe_secret = secrets.Secret(
            self, "StripeSecret",
            secret_name="drugai/stripe_secret_key",
            secret_string_value=SecretValue.plain_text(stripe_secret_value)
        )
        stripe_webhook_secret = secrets.Secret(
            self, "StripeWebhookSecret",
            secret_name="drugai/stripe_webhook_secret",
            secret_string_value=SecretValue.plain_text(stripe_webhook_value)
        )

        # ────────── DynamoDB ──────────
        table = ddb.Table(
            self, "UserUsageTable",
            table_name="DrugAIUserUsage",
            partition_key=ddb.Attribute(name="PK", type=ddb.AttributeType.STRING),
            sort_key=ddb.Attribute(name="SK", type=ddb.AttributeType.STRING),
            billing_mode=ddb.BillingMode.PAY_PER_REQUEST,
            time_to_live_attribute="ttl",
            removal_policy=RemovalPolicy.RETAIN,
        )

        # ────────── Authorizer ──────────
        jwt_auth = authorizers.HttpJwtAuthorizer(
            "ClerkAuthorizer",
            jwt_issuer=clerk_issuer,
            jwt_audience=clerk_audience,
        )

        # ────────── ML Inference Lambda (/invoke) ──────────
        ml_fn = _lambda.Function(
            self, "MLInferenceHandler",
            runtime=_lambda.Runtime.PYTHON_3_12,
            architecture=_lambda.Architecture.X86_64,
            handler="ml_inference_handler.lambda_handler",
            timeout=Duration.seconds(30),
            memory_size=1024,
            environment={
                "TABLE_NAME": table.table_name,
                "FREE_QUOTA": free_quota,
                "PRO_QUOTA": pro_quota,
            },
            code=_lambda.Code.from_asset(
                str(ROOT / "lambdas" / "ml_inference"),
                bundling=BundlingOptions(
                    image=_lambda.Runtime.PYTHON_3_12.bundling_image,
                    command=[
                        "bash","-c",
                        "pip install -r requirements.txt -t /asset-output "
                        "&& cp -au /asset-input/* /asset-output/"
                    ],
                ),
            ),
        )
        table.grant_read_write_data(ml_fn)

        # ────────── Stripe Webhook Lambda (/webhook) ──────────
        webhook_fn = _lambda.Function(
            self, "StripeWebhookHandler",
            runtime=_lambda.Runtime.PYTHON_3_12,
            architecture=_lambda.Architecture.X86_64,
            handler="stripe_webhook_handler.lambda_handler",
            timeout=Duration.seconds(30),
            memory_size=256,
            environment={
                "TABLE_NAME": table.table_name,
                "STRIPE_SECRET_ARN": stripe_secret.secret_arn,
                "STRIPE_WEBHOOK_SECRET_ARN": stripe_webhook_secret.secret_arn,
                "FREE_QUOTA": free_quota,
                "PRO_QUOTA": pro_quota,
            },
            code=_lambda.Code.from_asset(
                str(ROOT / "lambdas" / "stripe_webhook"),
                bundling=BundlingOptions(
                    image=_lambda.Runtime.PYTHON_3_12.bundling_image,
                    command=[
                        "bash","-c",
                        "pip install -r requirements.txt -t /asset-output "
                        "&& cp -au /asset-input/* /asset-output/"
                    ],
                ),
            ),
        )
        table.grant_read_write_data(webhook_fn)
        stripe_secret.grant_read(webhook_fn)
        stripe_webhook_secret.grant_read(webhook_fn)

        # ────────── Stripe Checkout Lambda (/checkout) ──────────
        checkout_fn = _lambda.Function(
            self, "StripeCheckoutHandler",
            runtime=_lambda.Runtime.PYTHON_3_12,
            architecture=_lambda.Architecture.X86_64,
            handler="stripe_checkout_handler.lambda_handler",
            timeout=Duration.seconds(30),
            memory_size=256,
            environment={
                "STRIPE_SECRET_ARN": stripe_secret.secret_arn,
                "STRIPE_PRICE_ID": stripe_price,
                "SUCCESS_URL": "http://localhost:5173/dashboard?success=1",
                "CANCEL_URL":  "http://localhost:5173/dashboard?canceled=1",
                "DASHBOARD_URL":"http://localhost:5173/dashboard",
            },
            code=_lambda.Code.from_asset(
                str(ROOT / "lambdas" / "stripe_checkout"),
                bundling=BundlingOptions(
                    image=_lambda.Runtime.PYTHON_3_12.bundling_image,
                    command=[
                        "bash","-c",
                        "pip install -r requirements.txt -t /asset-output "
                        "&& cp -au /asset-input/* /asset-output/"
                    ],
                ),
            ),
        )
        stripe_secret.grant_read(checkout_fn)

        # ────────── HTTP API & Routes ──────────
        http_api = apigw.HttpApi(self, "MLHttpApi",
            api_name="DrugAIHttpApi",
            create_default_stage=False,
            cors_preflight=apigw.CorsPreflightOptions(
                allow_origins=["http://localhost:5173"],
                allow_methods=[apigw.CorsHttpMethod.ANY],
                allow_headers=["Authorization","Content-Type"],
            ),
        )
        http_api.add_stage("DevStage", stage_name="dev", auto_deploy=True)
        for path, fn in [
            ("/invoke", ml_fn),
            ("/webhook", webhook_fn),
            ("/checkout", checkout_fn),
        ]:
            http_api.add_routes(
                path=path,
                methods=[apigw.HttpMethod.POST],
                integration=integrations.HttpLambdaIntegration(f"{path}-int", fn),
                authorizer= jwt_auth if path != "/webhook" else None
            )

        # ────────── Outputs ──────────
        CfnOutput(self, "ApiEndpoint", value=http_api.api_endpoint)
        CfnOutput(self, "TableName",    value=table.table_name)
