import ware from 'warewolf';
import { ValidationError } from '@omkartech/validation-error';
import { before, after } from '../src/index';

const defaultResponseConfig = {
  headers: {
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  },
  isBase64Encoded: false,
  statusCode: 200,
  body: {},
};

const event = {
  queryStringParameters: {
    color: 'red',
  },
  pathParameters: {
    id: 1,
  },
  body: {
    active: true,
  },
};
const context = {};
process.env.STAGE = 'dev';

// const done = (err) => {
//   // console.warn('warewolf done called', err);
// };

describe('500 response result', () => {
  test('expect message to have error', async (testDone) => {
    const callback = (err, success) => {
      const body = getBody(err, success);
      // console.warn(err, success, body);
      expect(success).toHaveProperty('statusCode', 500);
      expect(body).toHaveProperty('message', 'Error: This is bad');
      testDone();
    };

    await ware(
      before,
      async () => {
        throw new Error('This is bad');
      },
      after,
    )(event, context, callback);
  });
  test('expect response to have event', async (testDone) => {
    const callback = (err, success) => {
      const body = getBody(err, success);
      // console.warn(body);
      expect(success).toHaveProperty('statusCode', 500);
      expect(body).toHaveProperty('event');
      testDone();
    };

    const customEvent = { ...event, body: { ShowEvent: true } };

    await ware(
      before,
      async () => {
        throw new Error('This is bad');
      },
      after,
    )(customEvent, context, callback);
  });
});

describe('400 validation result', () => {
  test('expect message to have validations', async (testDone) => {
    const validationErrors = [
      { message: 'SSN is a required field', property: 'SSN' },
      { message: 'Cannot edit chads test worker' }];

    const callback = (err, success) => {
      const body = getBody(err, success);
      console.warn(err, success, body);
      expect(success).toHaveProperty('statusCode', 400);
      expect(body).toHaveProperty('errors', validationErrors);
      testDone();
    };

    await ware(
      before,
      async () => {
        const err = new ValidationError(validationErrors);

        throw err;
      },
      after,
    )(event, context, callback);
  });
});


describe('200 response result', () => {
  test('expect number result to return stringified in body', async (testDone) => {
    const callback = (err, success) => {
      const body = getBody(err, success);
      // console.warn(err, success, body);
      expect(success).toHaveProperty('statusCode', 200);
      expect(body).toBe(5);
      testDone();
    };

    await ware(
      before,
      async (e) => {
        e.result = 5;
      },
      after,
    )(event, context, callback);
  });
  test('expect object result to be stringified in body', async (testDone) => {
    const callback = (err, success) => {
      const body = getBody(err, success);
      // console.warn(err, success, body);
      expect(success).toHaveProperty('statusCode', 200);
      expect(body).toHaveProperty('color', 'blue');
      testDone();
    };

    await ware(
      before,
      async (e) => {
        e.result = { color: 'blue' };
      },
      after,
    )(event, context, callback);
  });
  test('expect no result to be empty object', async (testDone) => {
    const callback = (err, success) => {
      const body = getBody(err, success);
      // console.warn(err, success, body);
      expect(success).toHaveProperty('statusCode', 200);
      expect(body).toEqual({});
      testDone();
    };

    await ware(
      before,
      async (e) => {
        e.result = null;
      },
      after,
    )(event, context, callback);
  });
  test('expect headers can be overridden', async (testDone) => {
    const callback = (err, success) => {
      // console.warn(err, success);
      expect(success).toHaveProperty('statusCode', 200);
      expect(success).toHaveProperty('headers.myheader', 'value');
      testDone();
    };

    await ware(
      before,
      async (e) => {
        e.headers = { myheader: 'value' };
      },
      after,
    )(event, context, callback);
  });
  test('expect default 200 response', async (testDone) => {
    const callback = (err, success) => {
      // console.warn(err, success);
      expect(success).toHaveProperty('statusCode', 200);
      expect(success).toHaveProperty('headers', { ...defaultResponseConfig.headers, myheader: null });
      testDone();
    };

    ware(
      before,
      async (e) => {
        e.headers.myheader = null;
      },
      after,
    )(event, context, callback);
  });
  // test('expect string result to return in body', async () => {
  //   expect.assertions(1);
  //   const callback = jest.fn();

  //   // callback(null, { body: 'Test' });

  //   expect(callback).toBeCalledWith(
  //     expect.objectContaining({
  //       body: expect.any(String),
  //     }),
  //   );

  //   await ware(
  //     before,
  //     async (e) => {
  //       e.result = 'Test';
  //     },
  //     after,
  //   )(event, context, callback, done);
  // });
});

const getBody = (err, success) => {
  const body = (err || success).body;
  let parsedBody = body;
  try {
    parsedBody = JSON.parse(body);
  } catch (error) {
    console.warn(error);
  }
  return parsedBody;
};
