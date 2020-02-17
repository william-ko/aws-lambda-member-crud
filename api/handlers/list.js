const {db} = require('../dynamo/config');

module.exports.handler = async (event, context, callback) => {
  try {
    const params = {
      TableName: process.env.MEMBERS_TABLE,
    }

    const data = await db('scan', params)

    return {statusCode: 200, body: JSON.stringify({data})};
  } catch (error) {
    callback(JSON.stringify(error.stack));
  }
};