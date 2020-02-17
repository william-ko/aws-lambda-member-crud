const uuid = require('uuid');

module.exports = data => {
  return {
    id: uuid(),
    createdAt: new Date().toISOString(),
    ...data,
  };
};
