const cdk = require("@aws-cdk/core");
const lambda = require("@aws-cdk/aws-lambda");
const apigw = require("@aws-cdk/aws-apigateway");
const dynamo = require("@aws-cdk/aws-dynamodb");

class MollyCodeCdkStack extends cdk.Stack {
  /**
   *
   * @param {cdk.Construct} scope
   * @param {string} id
   * @param {cdk.StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

    // const runtime = lambda.Runtime.NODEJS_14_X

    // lambda functions
    const languagesLambda = new lambda.Function(this, "languagesHandler", {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset("functions"),
      handler: "function.handler",
    });

    const languageLambda = new lambda.Function(this, "languageHandler", {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset("functions"),
      handler: "function.languageHandler",
    });

    const versionLambda = new lambda.Function(this, "versionHandler", {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset("functions"),
      handler: "function.versionHandler",
    });

    const api = new apigw.RestApi(this, "api", {
      defaultCorsPreflightOptions: {
        allowHeaders: [
          "Content-Type",
          "X-Amz-Date",
          "Authorization",
          "X-Api-Key",
        ],
        allowMethods: ["OPTIONS", "GET", "POST", "PUT", "PATCH", "DELETE"],
        allowCredentials: true,
        allowOrigins: "*",
      },
    });

    //API Endpoints
    const languages = api.root.addResource("languages");
    languages.addMethod("GET", new apigw.LambdaIntegration(languagesLambda)); // GET languages

    const language = languages.addResource("{language}");
    language.addMethod("GET", new apigw.LambdaIntegration(languageLambda)); // GET /languages/:language

    const versions = language.addResource("latest");
    versions.addMethod("POST", new apigw.LambdaIntegration(versionLambda)); // GET /languages/:language/latest

    // output for API URL
    new cdk.CfnOutput(this, "HTTP API URL", {
      value: api.url ?? "Error during deploy",
    });
  }
}

module.exports = { MollyCodeCdkStack };
