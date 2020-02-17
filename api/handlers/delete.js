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
    const member = await db('get', params);

    if (isEmpty(member)) {
      throw new ResourceNotFoundError({message: 'Member not found'});
    }

    await db('delete', params);
    return {statusCode: 200, body: JSON.stringify({message: `Member ${id} deleted successfully`, deletedMember: member.Item})};
  } catch (error) {
    callback(JSON.stringify(error));
  }
}