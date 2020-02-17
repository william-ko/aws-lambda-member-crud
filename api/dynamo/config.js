const AWS = require('aws-sdk');

const db = async (action, params) => {
  const dynamoDb = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});
  return dynamoDb[action](params).promise();
};

module.exports = {
  db
};