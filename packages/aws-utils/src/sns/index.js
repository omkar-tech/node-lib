import AWS from 'aws-sdk';

const sns = new AWS.SNS({ apiVersion: '2010-03-31', region: 'us-west-2' });

export const TOPIC_FORMAT_NEW = 'TOPIC_FORMAT_NEW';
export const TOPIC_FORMAT_OLD = 'TOPIC_FORMAT_OLD';
export const TOPIC_FORMAT_APPENDED = 'TOPIC_FORMAT_APPENDED';

async function publishSns(topicName, payload, options = {}) {
  const {
    topicFormat = TOPIC_FORMAT_NEW,
  } = options;

  const stage = process.env.STAGE;
  const service = process.env.SERVICE;
  const topicPrefix = 'arn:aws:sns:us-west-2:OMKARTECH_TODO_ENTER_AWS_ACCOUNT_NBR';

  const topicFormatters = {
    TOPIC_FORMAT_NEW: `${topicPrefix}:${service}-${stage}-${topicName}`,
    TOPIC_FORMAT_APPENDED: `${topicPrefix}:${topicName}-${stage}`,
    TOPIC_FORMAT_OLD: `${topicPrefix}:${topicName}`,
  };

  const topicArn = topicFormatters[topicFormat];

  const response = await sns.publish({
    TopicArn: topicArn,
    Message: JSON.stringify(payload),
  }).promise();

  if (response.errorMessage) {
    throw new Error(`publishSns ${topicName} error ${response.errorMessage}, request payload ${JSON.stringify(payload)}`);
  }

  return response;
}

export async function publishSampleEvent(
  topicName,
  SomeOldKey,
  SomeNewKey,
  options = {},
) {
  const {
    topicFormat = TOPIC_FORMAT_NEW,
    notificationTitle = topicName,
  } = options;

  return publishSns(topicName, {
    OldPublicKey: SomeOldKey, // Old
    NewPublicKey: SomeNewKey, // New
    AnotherPublicKey: SomeOldKey,
    EventSource: 'SampleEvent',
    NotificationTitle: notificationTitle,
    stage: process.env.STAGE,
  }, { topicFormat });
}
