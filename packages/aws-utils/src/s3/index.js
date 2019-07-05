import AWS from 'aws-sdk';

const awsS3 = new AWS.S3({
  region: 'us-west-2',
  endpoint: 'https://s3.us-west-2.amazonaws.com',
});

export const getPrependedBucketName = (bucket, stage) => {
  if (!stage) {
    throw new Error('getPrependedBucketName() - stage is required');
  }
  if (!bucket) {
    throw new Error('getPrependedBucketName() - bucket is required');
  }
  return `${stage}-${bucket}`;
};

export const getS3Object = Bucket => (Key, options) =>
  awsS3
    .getObject({
      Bucket,
      Key,
      ...options,
    })
    .promise();

export const getS3Url = ({ bucket, key, options = {} }) => {
  const {
    prependStageToBucketName = false,
    stage = process.env.STAGE,
  } = options;

  const bucketName = prependStageToBucketName
    ? getPrependedBucketName(bucket, stage)
    : bucket;

  const params = {
    Bucket: bucketName,
    Key: key,
    Expires: options.expires,
  };
  return awsS3.getSignedUrl('getObject', params);
};

export const uploadFileToS3 = async ({ bucket, key, body, options = {} }) => {
  const {
    prependStageToBucketName = false,
    stage = process.env.STAGE,
  } = options;

  const bucketName = prependStageToBucketName
    ? getPrependedBucketName(bucket, stage)
    : bucket;

  try {
    const retVal = await awsS3
      .putObject({
        Bucket: bucketName,
        Key: key,
        Body: body,
      })
      .promise();
    return retVal;
  } catch (err) {
    const error = new Error(err.message);
    error.status = err.status;
    console.error('error uploading to S3:', JSON.stringify(err, null, 2));
    throw error;
  }
};

export const s3FileParser = (filepath) => {
  const [, , Bucket, ...file] = filepath.split('/');
  return {
    Bucket,
    Key: file.join('/'),
  };
};

export const getS3JSON = async ({ bucket, key, options = {} }) => {
  const {
    prependStageToBucketName = false,
    stage = process.env.STAGE,
  } = options;

  const bucketName = prependStageToBucketName
    ? getPrependedBucketName(bucket, stage)
    : bucket;

  try {
    const file = await getS3Object(bucketName)(key);
    return JSON.parse(file.Body);
  } catch (e) {
    throw e;
  }
};

export const s3FileExists = async ({ bucket, key }) => {
  try {
    const headobj = await awsS3
      .headObject({ Bucket: bucket, Key: key })
      .promise();

    return typeof headobj === 'object' && typeof headobj.ETag !== 'undefined';
  } catch (e) {
    if (
      e.code === 'NoSuchKey' ||
      e.code === 'Forbidden' ||
      e.code === 'NotFound' ||
      e.code === 'NoSuchBucket'
    ) {
      return false;
    }
    throw e;
  }
};

export const copyS3toS3 = async ({
  sourceBucket,
  sourceKey,
  targetBucket,
  targetKey,
  options = {},
}) => {
  const {
    prependStageToBucketName = false,
    stage = process.env.STAGE,
  } = options;

  const sourceBucketName = prependStageToBucketName
    ? getPrependedBucketName(sourceBucket, stage)
    : sourceBucket;

  const targetBucketName = prependStageToBucketName
    ? getPrependedBucketName(targetBucket, stage)
    : targetBucket;

  if (!sourceBucketName || sourceBucketName.length <= 0) {
    throw new Error(
      `Invalid Param. Source Bucket ${sourceBucketName} is required.`,
    );
  }
  if (!sourceKey || sourceKey.length <= 0) {
    throw new Error(`Invalid Param. Source key ${sourceKey} is required.`);
  }
  if (!targetBucketName || targetBucketName.length <= 0) {
    throw new Error(
      `Invalid Param. Target Bucket ${targetBucketName} is required.`,
    );
  }

  try {
    let newTargetKey = targetKey;
    if (!targetKey || targetKey.length <= 0) {
      newTargetKey = sourceKey;
    }
    const retVal = await awsS3
      .copyObject({
        Bucket: targetBucketName,
        CopySource: `${sourceBucketName}/${sourceKey}`,
        Key: newTargetKey,
      })
      .promise();
    return retVal;
  } catch (err) {
    const error = new Error(
      `Error copying file from S3: ${sourceBucketName}/${sourceKey} to S3: ${targetBucketName}/${targetKey}, message: ${
        err.message
      }`,
    );
    error.status = err.status;
    console.error(JSON.stringify(error, null, 2));
    throw error;
  }
};

/**
 * @description Moves a file from one s3 bucket to another bucket.
 * @param {sourceBucket, sourceKey, targetBucket, targetKey} sourceBucket
 */
export const moveS3toS3 = async ({
  sourceBucket,
  sourceKey,
  targetBucket,
  targetKey,
  options = {},
}) => {
  const {
    prependStageToBucketName = false,
    stage = process.env.STAGE,
  } = options;

  const sourceBucketName = prependStageToBucketName
    ? getPrependedBucketName(sourceBucket, stage)
    : sourceBucket;

  const targetBucketName = prependStageToBucketName
    ? getPrependedBucketName(targetBucket, stage)
    : targetBucket;

  try {
    const copyResp = await copyS3toS3({
      sourceBucket: sourceBucketName,
      sourceKey,
      targetBucket: targetBucketName,
      targetKey,
    });
    if (copyResp && copyResp.ETag) {
      // delete source object
      await awsS3
        .deleteObject({
          Bucket: sourceBucketName,
          Key: sourceKey,
        })
        .promise();
      return copyResp;
    }
    throw new Error('moveS3toS3() - copyResp not found');
  } catch (err) {
    const error = new Error(
      `Error moving file from S3: ${sourceBucketName}/${sourceKey} to S3: ${targetBucketName}/${targetKey}, message: ${
        err.message
      }`,
    );
    error.status = err.status;
    console.error(JSON.stringify(error, null, 2));
    throw error;
  }
};

export const deleteS3File = async ({ bucket, key, options = {} }) => {
  const {
    prependStageToBucketName = false,
    stage = process.env.STAGE,
  } = options;

  const bucketName = prependStageToBucketName
    ? getPrependedBucketName(bucket, stage)
    : bucket;

  try {
    const blnExists = await s3FileExists({
      bucket: bucketName,
      key,
    });
    if (blnExists) {
      // delete source object
      const retVal = await awsS3
        .deleteObject({
          Bucket: bucketName,
          Key: key,
        })
        .promise();
      if (retVal) {
        return {
          Bucket: bucketName,
          Key: key,
          KeyExists: true,
          Deleted: true,
          DeleteResponse: retVal,
        };
      }
      return {
        Bucket: bucketName,
        Key: key,
        KeyExists: true,
        Deleted: false,
        DeleteResponse: retVal,
      };
    }
    return {
      Bucket: bucketName,
      Key: key,
      KeyExists: false,
    };
  } catch (err) {
    const error = new Error(
      `Error Deleting file from S3: ${bucketName}/${key}, error: ${err.message}`,
    );
    error.status = err.status;
    console.error(JSON.stringify(error, null, 2));
    throw error;
  }
};

export async function getFileFromS3(bucket, key, options = {}) {
  const {
    prependStageToBucketName = true,
    stage = process.env.STAGE,
  } = options;

  const bucketName = prependStageToBucketName
    ? getPrependedBucketName(bucket, stage)
    : bucket;

  try {
    const data = await getS3Object(bucketName)(key);
    const text = data.Body.toString('utf-8');

    return text;
  } catch (error) {
    throw new Error('error loading file from s3 bucket');
  }
}

export async function putJsonToS3(bucket, key, obj, options = {}) {
  const {
    prependStageToBucketName = true,
    stage = process.env.STAGE,
  } = options;

  const bucketName = prependStageToBucketName
    ? getPrependedBucketName(bucket, stage)
    : bucket;

  try {
    await awsS3
      .putObject({
        Bucket: bucketName,
        Key: key,
        Body: JSON.stringify(obj, null, 2),
      })
      .promise();
  } catch (error) {
    throw new Error('error saving file to s3 bucket');
  }

  return key;
}
