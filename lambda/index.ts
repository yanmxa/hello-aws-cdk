import { 
  APIGatewayProxyEvent, 
  APIGatewayProxyResult } 
from "aws-lambda/trigger/api-gateway-proxy";


exports.handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Hello from the Lambda function!' }),
  };
};