import { Stack, StackProps, Construct } from '@aws-cdk/core';
import { Vpc, SecurityGroup, Peer, Port, SubnetType } from '@aws-cdk/aws-ec2';
import { Function, Runtime, Code } from '@aws-cdk/aws-lambda';
import { RestApi, LambdaIntegration } from '@aws-cdk/aws-apigateway';
import { CfnOutput } from '@aws-cdk/core';
import { NodejsFunction } from '@aws-cdk/aws-lambda-nodejs';

export class HelloCdkGptStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Create a new VPC
    const vpc = new Vpc(this, 'MyVpc', {
      maxAzs: 2, // Configure the number of availability zones
    });

    // Allow HTTP/HTTPS traffic from any IPv4 IP to the VPC
    const securityGroup = new SecurityGroup(this, 'MySecurityGroup', {
      vpc,
      allowAllOutbound: true,
    });

    securityGroup.addIngressRule(Peer.ipv4('0.0.0.0/0'), Port.tcp(80));
    securityGroup.addIngressRule(Peer.ipv4('0.0.0.0/0'), Port.tcp(443));

    // Create a Lambda function
    // const lambdaFunction = new Function(this, 'HelloLambda', {
    //   runtime: Runtime.NODEJS_14_X,
    //   code: Code.fromAsset('lambda'), // Path to your lambda function code
    //   handler: 'index.handler', // Assuming your entry file is named "index.ts"
    //   vpc,
    //   vpcSubnets: { subnetType: SubnetType.PRIVATE },
    // });
    const lambdaFunction = new NodejsFunction(this, 'HelloLambda', {
      runtime: Runtime.NODEJS_14_X,
      entry: 'lambda/index.ts',
      handler: 'handler',
      vpc,
      vpcSubnets: { subnetType: SubnetType.PRIVATE },
    });

    // Expose the Lambda via REST API
    const api = new RestApi(this, 'HelloApi');
    const helloResource = api.root.addResource('hello');
    const lambdaIntegration = new LambdaIntegration(lambdaFunction);
    helloResource.addMethod('GET', lambdaIntegration);

    // Output the URL to access the Lambda function
    new CfnOutput(this, 'LambdaUrl', {
      value: api.url + 'hello',
    });
  }
}

