import ware from 'warewolf';
import { before } from '../src/index';

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
// const done = () => console.warn('done called');
const callback = () => {};
process.env.STAGE = 'dev';

describe('Event params should flow through', () => {
  test('expect query to equal path and query combined', async (testDone) => {
    await ware(
      before,
      async (e) => {
        expect(e.query).toEqual({ ...event.pathParameters, ...event.queryStringParameters });
        testDone();
      },
    )(event, context, callback);
  });
  test('expect queryAndParams to have query and pathParameters', async (testDone) => {
    // expect.assertions(2);
    await ware(
      before,
      async (e) => {
        expect(e).toHaveProperty('queryAndParams.color', 'red');
        expect(e).toHaveProperty('queryAndParams.id', 1);
        testDone();
      },
    )(event, context, callback);
  });
  test('expect body to have body', async (testDone) => {
    await ware(
      before,
      async (e) => {
        expect(e.body.active).toBe(true);
        testDone();
      },
    )(event, context, callback);
  });
  test('allow a string body to be parsed', async (testDone) => {
    const eventParse = { body: '{"active": true}' };
    await ware(
      before,
      async (e) => {
        // console.warn(e);
        expect(e.body.active).toBe(true);
        testDone();
      },
    )(eventParse, context, callback);
  });
  test('expect context.callbackWaitsForEmptyEventLoop to be false', async (testDone) => {
    const eventParse = { };
    await ware(
      before,
      async (e, c) => {
        // console.warn(e);
        expect(c.callbackWaitsForEmptyEventLoop).toBe(false);
        testDone();
      },
    )(eventParse, context, callback);
  });
});

