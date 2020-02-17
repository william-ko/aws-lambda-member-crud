'use strict';

const RandomUserService = require('../services');
const userService = new RandomUserService({baseUrl: 'https://randomuser.me'});

module.exports = async () => {
  const {
    data: {results},
  } = await userService.get('/api');

  const member = results[0];

  return {
    email: member.email,
    username: member.login.username,
    firstname: member.name.first,
    lastname: member.name.last,
  };
};
