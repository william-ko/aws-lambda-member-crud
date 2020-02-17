'use strict';

const {get, isEmpty} = require('lodash');
const {validateBody, createRandomMember, buildMemberObject} = require('./utils');

const AWS = require('aws-sdk');
const db = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});

module.exports.create = async (event, context, callback) => {
  let member;
  const body = JSON.parse(get(event, 'body'));

  try {
    if (!isEmpty(body)) {
      validateBody(body);
      member = buildMemberObject(body);
    } else {
      const randomMember = await createRandomMember();
      member = buildMemberObject(randomMember);
    }

    const params = {
      TableName: process.env.MEMBERS_TABLE,
      Item: member,
    };

    await db.put(params).promise();
    return {statusCode: 201, body: JSON.stringify({params})};
  } catch (error) {
    // need to properly handle errors
    const errorObj = {
      requestId: context.awsRequestId,
      code: error.code,
      diagnostics: error.message,
      trace: [error.stack],
    };

    callback(JSON.stringify(errorObj));
  }
};
