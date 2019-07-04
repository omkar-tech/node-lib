# AWS Utils

Functions to invoke Lambdas, publish to SNS, and interface with S3

## Install

```bash
npm install --save @omkar-tect/aws-utils
```

## Usage

## Lambda 

```js
import {
  invokeLambda,
  adminRequestContext,
} from '@omkar-tect/aws-utils'

const stage = process.env.STAGE;
const cart = await invokeLambda(`enrollment-service-${stage}-cart-get`, {
  pathParameters: {
    EnrollmentPublicKey: enrollmentPublicKey,
  },
  queryStringParameters: {
    SkipSave: true,
    AutoAddBenefits: true,
  },
}, {
  requestContext: adminRequestContext,
  appendStage: false,
});

// For asynchronous execution, you can supply "Event" for invocationType on the options
const cart = await invokeLambda(`enrollment-service-${stage}-cart-get`, {
  pathParameters: {
    ...
  },
  queryStringParameters: {
    ...
  },
}, {
  requestContext: adminRequestContext,
  appendStage: false,
  invocationType: "Event"
});
```

## SNS

```js
import {
  publishEnrollmentEvent,
  TOPIC_FORMAT_APPENDED,  
} from '@omkar-tect/aws-utils'

const stage = process.env.STAGE;
await publishEnrollmentEvent('cart-commit', employeePublicKey, enrollmentPublicKey, { topicFormat: TOPIC_FORMAT_APPENDED, notificationTitle: 'Cart Committed' });
```

## S3

```js
import {
  copyS3toS3,
  deleteS3File,
  moveS3toS3,
  s3FileExists,
  uploadFileToS3,
} from '@omkar-tect/aws-utils'

// Operations
await copyS3toS3({ sourceBucket, sourceKey, targetBucket, targetKey })
await moveS3toS3({ sourceBucket, sourceKey, targetBucket, targetKey })
await deleteS3File({ sourceBucket, sourceKey })
await uploadFileToS3({ bucket, key, body })

// Utilities
const exists = await s3FileExists({ bucket, key })
const parsed = s3FileParser('s3://dev-ods-data/dynamotableschema/test.json')
// "parsed" is an object with Bucket and Key properties:
// {
//   Bucket: 'dev-ods-data',
//   Key: 'dynamotableschema/test.json'
// }

```
