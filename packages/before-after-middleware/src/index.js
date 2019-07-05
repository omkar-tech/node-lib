import http from 'http';
import ware from 'warewolf';
import { isError, isObject, isString } from 'lodash';

export const before = ware(
  async (event, context) => {
    if (context) {
      context.callbackWaitsForEmptyEventLoop = false;
    }
    event = isObject(event) ? event : {};
    const {
      queryStringParameters = {},
      pathParameters = {},
      body,
    } = event;
    Object.assign(
      event,
      { stage: process.env.STAGE },
      { query: ({ ...queryStringParameters, ...pathParameters, ...event.query }) },
      { queryAndParams: ({ ...queryStringParameters, ...pathParameters, ...event.query }) },
      { body: isString(body) ? safeJSON.parse(body) : (body || {}) },
    );
  },
);

export const after = [
  errorHandler(),
  successController(),
];

function successController() {
  return (event, context, callback) => {
    const errorResponse = context.errorResponseToReturn;
    if (errorResponse) {
      delete context.errorResponseToReturn;
      callback(null, errorResponse);
      return;
    }

    const response = {
      ...defaultResponseConfig,
      headers: {
        ...defaultResponseConfig.headers,
        ...event.headers,
      },
      body: safeJSON.stringify(event.result || {}),
    };
    callback(null, response);
  };
}

function errorHandler() {
  // Error handler will be called by warewolf when error is raised in middleware due to its arity of +1
  // https://www.npmjs.com/package/warewolf
  return (error, event, context, callback) => {
    // console.log('BEFORE ERROR HANDLER');
    const statusCode = getStatusCode(error, event);
    const defaultError = new Error(http.STATUS_CODES[statusCode] || 'An Error Has Occured');
    const message = `${isError(error) ? error : defaultError}`;
    const type = http.STATUS_CODES[statusCode] || http.STATUS_CODES[500];
    const errors = error.errors;
    // add stack trace ifs running in 'dev' or 'int', and have opted-in
    const stack = (process.env.STAGE === 'dev' || process.env.STAGE === 'int') /* &&  statusCode !== 400 */ ? error.stack : undefined;
    const response = {
      ...defaultResponseConfig,
      statusCode,
      body: safeJSON.stringify({
        status: statusCode,
        type,
        message,
        errors,
        stack,
        event: showEvent(event),
      }),
    };
    context.errorResponseToReturn = response;
    // console.warn causes unhandled errors to be written to cloudwatch logs for debugging.
    // This is useful especially usefully for debugging triggered lambda.
    console.error(error);
    console.error(event);
    // LAMBDA PROXY mode requires errors be in the same format as success responses
    callback(null, response);
  };
}

const defaultResponseConfig = {
  headers: {
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  },
  isBase64Encoded: false,
  statusCode: 200,
};

const showEvent = event => ((event.body.ShowEvent || (event.queryAndParams && event.queryAndParams.ShowEvent)) ? event : undefined);

function getStatusCode(error, event) {
  // TODO: Refactor this function
  let statusCode = 500;
  if (error && error.statusCode) {
    statusCode = error.statusCode;
  } else if (event && event.statusCode) {
    statusCode = event.statusCode;
  } else if (error && error.error && error.error.statusCode) {
    statusCode = error.error.statusCode;
  } else if (event && event.error && event.error.statusCode) {
    statusCode = event.error.statusCode;
  }
  statusCode = Number.parseInt(statusCode, 10);
  return http.STATUS_CODES[statusCode] ? statusCode : 500;
}

export const safeJSON = {
  parse: (input) => {
    try {
      return JSON.parse(input);
    } catch (e) {
      return '{}';
    }
  },
  stringify: (input) => {
    try {
      return isString(input) ? input : JSON.stringify(input);
    } catch (e) {
      return '{}';
    }
  },
};
