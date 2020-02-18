'use strict';

const {isEmpty} = require('lodash');
const {db} = require('../dynamo/config');
const {ResourceNotFoundError} = require('../errors');

module.exports.handler = async (event, context, callback) => {
  const id = event.pathParameters.id;

  const params = {
    Key: {
      id,
    },
    TableName: process.env.MEMBERS_TABLE,
  };

  try {
    const data = await db('get', params);

    if (isEmpty(data)) {
      throw new ResourceNotFoundError({message: 'Member not found'});
    }

    return {statusCode: 200, body: JSON.stringify({data})};
  } catch (error) {
    callback(JSON.stringify(error));
  }
};
