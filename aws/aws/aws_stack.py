from pathlib import Path
from aws_cdk import (
    Stack, Duration, BundlingOptions, RemovalPolicy,
    CfnOutput,
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

        # ────────── Parameters you may tweak ──────────
        clerk_issuer   = "https://finer-molly-35.clerk.accounts.dev"
        clerk_audience = ["pk_test_ZmluZXItbW9sbHktMzUuY2xlcmsuYWNjb3VudHMuZGV2JA"]
        free_quota     = "5"
        stripe_price   = "price_1RLgj6PMlnECffWD9uiVzrSJ"

        stripe_secret = secrets.Secret.from_secret_name_v2(
            self, "StripeSecret", "drugai/stripe_secret_key"
        )
        stripe_webhook_secret = secrets.Secret.from_secret_name_v2(
            self, "StripeWebhookSecret", "drugai/stripe_webhook_secret"
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

        # ────────── Lambda: inference ──────────
        lambda_src = ROOT / "lambdas" / "ml_inference"
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
            },
            code=_lambda.Code.from_asset(
                str(lambda_src),
                bundling=BundlingOptions(
                    image=_lambda.Runtime.PYTHON_3_12.bundling_image,
                    command=[
                        "bash", "-c",
                        "pip install -r requirements.txt -t /asset-output "
                        "&& cp -au /asset-input/* /asset-output/"
                    ],
                ),
            ),
        )
        table.grant_read_write_data(ml_fn)

        # ────────── Lambda: Stripe webhook ──────────
        webhook_src = ROOT / "lambdas" / "stripe_webhook"
        webhook_fn = _lambda.Function(
            self, "StripeWebhookHandler",
            runtime=_lambda.Runtime.PYTHON_3_12,
            architecture=_lambda.Architecture.X86_64,
            handler="stripe_webhook_handler.lambda_handler",
            timeout=Duration.seconds(30),
            memory_size=256,
            environment={
                "TABLE_NAME": table.table_name,
                "STRIPE_PRICE_ID": stripe_price,
                "STRIPE_SECRET_ARN": stripe_secret.secret_arn,
                "STRIPE_WEBHOOK_SECRET_ARN": stripe_webhook_secret.secret_arn,
                "FREE_QUOTA": free_quota,
            },
            code=_lambda.Code.from_asset(
                str(webhook_src),
                bundling=BundlingOptions(
                    image=_lambda.Runtime.PYTHON_3_12.bundling_image,
                    command=[
                        "bash", "-c",
                        "pip install -r requirements.txt -t /asset-output "
                        "&& cp -au /asset-input/* /asset-output/"
                    ],
                ),
            ),
        )
        table.grant_read_write_data(webhook_fn)
        stripe_secret.grant_read(webhook_fn)
        stripe_webhook_secret.grant_read(webhook_fn)

        # ────────── JWT Authorizer ──────────
        jwt_auth = authorizers.HttpJwtAuthorizer(
            "ClerkAuthorizer",
            jwt_issuer=clerk_issuer,
            jwt_audience=clerk_audience,
        )

        # ────────── HTTP API with CORS ──────────
        http_api = apigw.HttpApi(
            self, "MLHttpApi",
            api_name="MLInferenceAPI",
            create_default_stage=False,
            cors_preflight=apigw.CorsPreflightOptions(
                allow_origins=["http://localhost:5173"],
                allow_methods=[apigw.CorsHttpMethod.ANY],
                allow_headers=["Authorization", "Content-Type"],
                # must be False (or omitted) when origin list is not "*"
                allow_credentials=False,
            ),
        )

        # Stage
        http_api.add_stage(
            "DevStage",
            stage_name="dev",
            auto_deploy=True,
        )

        # Routes
        http_api.add_routes(
            path="/invoke",
            methods=[apigw.HttpMethod.POST],
            integration=integrations.HttpLambdaIntegration(
                "MLIntegration", ml_fn
            ),
            authorizer=jwt_auth,
        )
        http_api.add_routes(
            path="/webhook",
            methods=[apigw.HttpMethod.POST],
            integration=integrations.HttpLambdaIntegration(
                "StripeWebhookIntegration", webhook_fn
            ),
        )

        # Outputs
        CfnOutput(self, "MLHttpApiEndpoint", value=http_api.api_endpoint)
        CfnOutput(self, "UserUsageTableName", value=table.table_name)
