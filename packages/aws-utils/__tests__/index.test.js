import {
  copyS3toS3,
  deleteS3File,
  getFileFromS3,
  getPrependedBucketName,
  getS3JSON,
  getS3Url,
  moveS3toS3,
  putJsonToS3,
  s3FileExists,
  s3FileParser,
  uploadFileToS3,
} from '../src/s3/index';

const testObj = { OmkarTech: 'Utils' };

describe('getPrependedBucketName()', () => {
  it('Should return concatenated bucket name with valid arguments', () => {
    const bucketName = getPrependedBucketName('some-bucket', 'int');
    expect(bucketName).toEqual('int-some-bucket');
  });

  it("Should error if it doesn't receive both arguments", () => {
    expect(() => getPrependedBucketName()).toThrow();
    expect(() => getPrependedBucketName('bucket-name')).toThrow();
  });
});

describe('s3FileParser()', () => {
  it('Should return an object with Bucket and Key properties for valid S3 links', () => {
    const parsed = s3FileParser(
      's3://omkartech-aws-utils-test/dynamotableschema/test.json',
    );
    expect(parsed).toEqual({
      Bucket: 'omkartech-aws-utils-test',
      Key: 'dynamotableschema/test.json',
    });
  });
});

describe('uploadFileToS3()', () => {
  it('Should successfully upload a file to S3', async () => {
    await uploadFileToS3({
      bucket: 'omkartech-aws-utils-test',
      key: 'test.json',
      body: JSON.stringify(testObj, null, 2),
      options: {},
    });
  });

  it('Should prepend stage when stage and prependStageToBucketName are provided', async () => {
    const options = {
      stage: 'omkartech',
      prependStageToBucketName: true,
    };

    await uploadFileToS3({
      bucket: 'aws-utils-test',
      key: 'test2.json',
      body: JSON.stringify({}, null, 2),
      options,
    });
  });
});

describe('getS3Url()', () => {
  it('Should return a valid url for valid bucket and key arguments', () => {
    const url = getS3Url({
      bucket: 'omkartech-aws-utils-test',
      key: 'test.json',
    });
    expect(
      url.includes(
        'https://omkartech-aws-utils-test.s3.us-west-2.amazonaws.com/test.json',
      ),
    ).toEqual(true);
  });

  it('Should return a valid url with expiration when expires arg is provided ', () => {
    const url = getS3Url({
      bucket: 'omkartech-aws-utils-test',
      key: 'test.json',
      options: {
        expires: 30,
      },
    });
    expect(
      url.includes(
        'https://omkartech-aws-utils-test.s3.us-west-2.amazonaws.com/test.json',
      ),
    ).toEqual(true);
  });

  it('Should prepend stage when stage and prependStageToBucketName are provided', async () => {
    const options = {
      stage: 'omkartech',
      prependStageToBucketName: true,
    };
    const url = getS3Url({
      bucket: 'aws-utils-test',
      key: 'test.json',
      options,
    });
    expect(
      url.includes(
        'https://omkartech-aws-utils-test.s3.us-west-2.amazonaws.com/test.json',
      ),
    ).toEqual(true);
  });
});

describe('getS3JSON()', () => {
  it('Should get JSON file from S3', async () => {
    const res = await getS3JSON({
      bucket: 'omkartech-aws-utils-test',
      key: 'test.json',
    });
    expect(res).toEqual(testObj);
  });

  it('Should prepend stage when stage and prependStageToBucketName are provided', async () => {
    const options = {
      stage: 'omkartech',
      prependStageToBucketName: true,
    };

    const res = await getS3JSON({
      bucket: 'aws-utils-test',
      key: 'test.json',
      options,
    });
    expect(res).toEqual(testObj);
  });
});

describe('s3FileExists()', () => {
  it('Should return true if file exists', async () => {
    const res = await s3FileExists({
      bucket: 'omkartech-aws-utils-test',
      key: 'test.json',
    });
    expect(res).toEqual(true);
  });

  it('Should return false if file does not exist', async () => {
    const res = await s3FileExists({
      bucket: 'omkartech-aws-utils-test',
      key: 'not-here.json',
    });
    expect(res).toEqual(false);
  });
});

describe('copyS3toS3()', () => {
  it('Should copy the file from one bucket to another', async () => {
    await copyS3toS3({
      sourceBucket: 'omkartech-aws-utils-test',
      sourceKey: 'test.json',
      targetBucket: 'omkartech-aws-utils-test-target',
      targetKey: 'test-copy.json',
    });

    const originalExists = await s3FileExists({
      bucket: 'omkartech-aws-utils-test',
      key: 'test.json',
    });

    const copyExists = await s3FileExists({
      bucket: 'omkartech-aws-utils-test-target',
      key: 'test-copy.json',
    });

    const original = await getS3JSON({
      bucket: 'omkartech-aws-utils-test',
      key: 'test.json',
    });

    const copy = await getS3JSON({
      bucket: 'omkartech-aws-utils-test-target',
      key: 'test-copy.json',
    });

    // Both exist
    expect(originalExists).toEqual(true);
    expect(copyExists).toEqual(true);

    // Both have the same content
    expect(original).toEqual(testObj);
    expect(copy).toEqual(testObj);
  });

  it('Should prepend stage when stage and prependStageToBucketName are provided', async () => {
    await copyS3toS3({
      sourceBucket: 'aws-utils-test',
      sourceKey: 'test.json',
      targetBucket: 'aws-utils-test-target',
      targetKey: 'test-copy.json',
      options: {
        stage: 'omkartech',
        prependStageToBucketName: true,
      },
    });

    const originalExists = await s3FileExists({
      bucket: 'omkartech-aws-utils-test',
      key: 'test.json',
    });

    const copyExists = await s3FileExists({
      bucket: 'omkartech-aws-utils-test-target',
      key: 'test-copy.json',
    });

    const original = await getS3JSON({
      bucket: 'omkartech-aws-utils-test',
      key: 'test.json',
    });

    const copy = await getS3JSON({
      bucket: 'omkartech-aws-utils-test-target',
      key: 'test-copy.json',
    });

    // Both exist
    expect(originalExists).toEqual(true);
    expect(copyExists).toEqual(true);

    // Both have the same content
    expect(original).toEqual(testObj);
    expect(copy).toEqual(testObj);
  });
});

describe('moveS3toS3()', () => {
  beforeEach(async () =>
    uploadFileToS3({
      bucket: 'omkartech-aws-utils-test',
      key: 'to-be-moved.json',
      body: JSON.stringify(testObj, null, 2),
    }),
  );

  it('Should move the file from one bucket to another', async () => {
    await moveS3toS3({
      sourceBucket: 'omkartech-aws-utils-test',
      sourceKey: 'to-be-moved.json',
      targetBucket: 'omkartech-aws-utils-test-target',
      targetKey: 'moved.json',
    });

    const uploadExistsAfterMove = await s3FileExists({
      bucket: 'omkartech-aws-utils-test',
      key: 'to-be-moved.json',
    });
    expect(uploadExistsAfterMove).toEqual(false);

    const targetExistsAfterMove = await s3FileExists({
      bucket: 'omkartech-aws-utils-test-target',
      key: 'moved.json',
    });
    expect(targetExistsAfterMove).toEqual(true);
  });
});

describe('getFileFromS3()', () => {
  it('Should get file from S3', async () => {
    const bucket = 'omkartech-aws-utils-test';
    const key = 'test.json';
    const res = await getFileFromS3(bucket, key, {
      prependStageToBucketName: false,
    });
    expect(res).toBeDefined();
  });

  it('Should prepend stage when stage and prependStageToBucketName are provided', async () => {
    const bucket = 'aws-utils-test';
    const key = 'test.json';
    const res = await getFileFromS3(bucket, key, {
      stage: 'omkartech',
    });
    expect(res).toBeDefined();
  });
});

describe('putJsonToS3()', () => {
  beforeEach(async () =>
    deleteS3File({
      bucket: 'omkartech-aws-utils-test',
      key: 'put-file.json',
    }),
  );

  afterEach(async () =>
    deleteS3File({
      bucket: 'omkartech-aws-utils-test',
      key: 'put-file.json',
    }),
  );

  it('Should put file in S3 bucket', async () => {
    const bucket = 'omkartech-aws-utils-test';
    const key = 'put-file.json';

    await putJsonToS3(bucket, key, testObj, {
      prependStageToBucketName: false,
    });

    const existsAfterPut = await s3FileExists({
      bucket,
      key,
    });
    expect(existsAfterPut).toEqual(true);
  });

  it('Should prepend stage when stage and prependStageToBucketName are provided', async () => {
    const bucket = 'aws-utils-test';
    const key = 'put-file.json';

    await putJsonToS3(bucket, key, testObj, {
      stage: 'omkartech',
    });

    const existsAfterPut = await s3FileExists({
      bucket: 'omkartech-aws-utils-test',
      key,
    });
    expect(existsAfterPut).toEqual(true);
  });
});

describe('deleteS3File()', () => {
  beforeEach(async () =>
    uploadFileToS3({
      bucket: 'omkartech-aws-utils-test',
      key: 'test.json',
      body: JSON.stringify(testObj, null, 2),
    }),
  );

  it('Should delete files from S3 for a given bucket and key', async () => {
    await deleteS3File({
      bucket: 'omkartech-aws-utils-test',
      key: 'test.json',
    });
  });

  it('Should prepend stage when stage and prependStageToBucketName are provided', async () => {
    await deleteS3File({
      bucket: 'aws-utils-test',
      key: 'test.json',
      options: {
        stage: 'omkartech',
        prependStageToBucketName: true,
      },
    });
  });
});
