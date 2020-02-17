'use strict';

const {get, isEmpty} = require('lodash');
const {db} = require('../dynamo/config');
const {validateBody, createRandomMember, buildMemberObject} = require('../utils');

module.exports.handler = async (event, context, callback) => {
  let member;
  const body = JSON.parse(get(event, 'body'));

  try {
    if (!isEmpty(body)) {
      validateBody(body, 'POST');
      member = buildMemberObject(body);
    } else {
      const randomMember = await createRandomMember();
      member = buildMemberObject(randomMember);
    }

    const params = {
      TableName: process.env.MEMBERS_TABLE,
      Item: member,
    };

    await db('put', params);
    return {statusCode: 201, body: JSON.stringify({params})};
  } catch (error) {
    callback(JSON.stringify(error));
  }
};