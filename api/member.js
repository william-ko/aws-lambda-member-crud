'use strict';

const {get, isEmpty} = require('lodash');
const {ResourceNotFoundError, InternalError} = require('./errors');
const {validateBody, createRandomMember, buildMemberObject} = require('./utils');

const AWS = require('aws-sdk');
const db = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});

// Create a member
module.exports.create = async (event, context, callback) => {
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

    await db.put(params).promise();
    return {statusCode: 201, body: JSON.stringify({params})};
  } catch (error) {
    callback(JSON.stringify(error));
  }
};

// Get all members
module.exports.getAllMembers = async (event, context, callback) => {
  try {
    const data = await db
      .scan({
        TableName: process.env.MEMBERS_TABLE,
      })
      .promise();

    return {statusCode: 200, body: JSON.stringify({data})};
  } catch (error) {
    callback(JSON.stringify(error.stack));
  }
};

// Get a member by their ID
module.exports.getMember = async (event, context, callback) => {
  const id = event.pathParameters.id;

  const params = {
    Key: {
      id,
    },
    TableName: process.env.MEMBERS_TABLE,
  };

  try {
    const data = await db.get(params).promise();

    if (isEmpty(data)) {
      throw new ResourceNotFoundError({message: 'Member not found'});
    }

    return {statusCode: 200, body: JSON.stringify({data})};
  } catch (error) {
    callback(JSON.stringify(error));
  }
};

// Update a member
module.exports.updateMember = async (event, context, callback) => {
  const id = event.pathParameters.id;
  const body = JSON.parse(get(event, 'body'));

  validateBody(body, 'PUT');

  const {parameterName, parameterValue} = body;

  const params = {
    Key: {
      id
    },
    TableName: process.env.MEMBERS_TABLE,
    ConditionExpression: 'attribute_exists(id)',
    UpdateExpression: `set ${parameterName} = :v`,
    ExpressionAttributeValues: {
      ':v': parameterValue
    },
    ReturnValues: 'ALL_NEW'
  }

  try {
    const data = await db.update(params).promise();

    if (isEmpty(data)) {
      throw new ResourceNotFoundError({message: 'Member not found'});
    }

    return {statusCode: 200, body: JSON.stringify({data})};
  } catch (error) {
    callback(JSON.stringify(error));
  }
}

// Delete a member
module.exports.deleteMember = async (event, context, callback) => {
  const id = event.pathParameters.id;

  const params = {
    Key: {
      id,
    },
    TableName: process.env.MEMBERS_TABLE,
  };

  try {
    const member = await db.get(params).promise();

    if (isEmpty(member)) {
      throw new ResourceNotFoundError({message: 'Member not found'});
    }

    await db.delete(params).promise();
    return {statusCode: 200, body: JSON.stringify({message: `Member ${id} deleted successfully`, deletedMember: member})};
  } catch (error) {
    callback(JSON.stringify(error));
  }
}