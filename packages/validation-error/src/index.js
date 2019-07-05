export class ValidationError extends Error {
  constructor(params) {
    super(params);
    let msg = '';
    if (Array.isArray(params)) {
      params.forEach((param) => {
        if (param.message) {
          msg = msg.concat(`${param.message}\n`);
        }
      });
      this.errors = params;
    } else if (params.message) {
      msg = params.message;
    } else {
      msg = JSON.stringify(params, null, 2);
    }
    this.message = msg;
    this.name = 'ValidationError';
    this.statusCode = 400; // not sure if this is right.
    Error.captureStackTrace(this, ValidationError);
  }
}
