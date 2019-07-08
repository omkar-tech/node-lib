# `@omkartech/service-request`

The goal of this package is to centralize the boilerplate request setup and handling to any requests to lambda.


**Import the service**

```js
import serviceRequest from '@omkartech/service-request'
```

**Common request helper syntax**

```js
const lambdaFunction = params.FunctionName
const awsRegion = 'us-west-2'
const lambdaPayLoad = {}
  try {
    // find the lambda to invoke
    const svcParams = {
      InvocationType: 'Event',
      region: awsRegion || 'us-west-2',
    }
    // invoke lambda
    const resp = await serviceRequest(lambdaFunction, svcParams).request(lambdaPayLoad)
  } catch (err) {
    console.error(`Error in calling Lambda: ${lambdaFunction}, error: ${err.message}`)
    throw new Error(`Error in calling Lambda: ${lambdaFunction}, error: ${err.message}`)
  }
```
