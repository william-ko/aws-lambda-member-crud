'use strict';

const {get, isEmpty} = require('lodash');
const {db} = require('../dynamo/config');
const {validateBody} = require('../utils');
const {ResourceNotFoundError} = require('../errors');

module.exports.handler = async (event, context, callback) => {
  const id = event.pathParameters.id;
  const body = JSON.parse(get(event, 'body'));

  validateBody(body, 'PUT');

  const {parameterName, parameterValue} = body;

  const params = {
    Key: {
      id,
    },
    TableName: process.env.MEMBERS_TABLE,
    ConditionExpression: 'attribute_exists(id)',
    UpdateExpression: `set ${parameterName} = :v`,
    ExpressionAttributeValues: {
      ':v': parameterValue,
    },
    ReturnValues: 'ALL_NEW',
  };

  try {
    const data = await db('update', params);

    if (isEmpty(data)) {
      throw new ResourceNotFoundError({message: 'Member not found'});
    }

    return {statusCode: 200, body: JSON.stringify({data: data.Attributes})};
  } catch (error) {
    callback(JSON.stringify(error));
  }
};
