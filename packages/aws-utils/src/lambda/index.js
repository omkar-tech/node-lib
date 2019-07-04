import AWS from 'aws-sdk';

const lambda = new AWS.Lambda({ region: 'us-west-2' });

export async function invokeLambda(functionName, payload, options = {}) {
  const {
    requestContext = null,
    appendStage = true,
    invocationType = null,
  } = options;

  const stage = process.env.STAGE;
  const rawResponse = await (lambda.invoke({
    FunctionName: appendStage ? `${functionName}:${stage}` : functionName,
    Payload: JSON.stringify({ ...payload, requestContext }),
    InvocationType: invocationType,
  }).promise());

  let response = JSON.parse(rawResponse.Payload);

  if (!response) {
    throw new Error(`invokeLambda ${functionName} can't parse the raw response ${JSON.stringify(rawResponse)}, request payload ${JSON.stringify(payload)}`);
  }

  if (response.body) {
    response = JSON.parse(response.body);
  }

  if (response.errorMessage || response.message) {
    throw new Error(`invokeLambda ${functionName} error ${response.errorMessage || response.message}, request payload ${JSON.stringify(payload)}, stack: ${response.stack}`);
  }

  return response;
}
