const {forEach, isString, size} = require('lodash');
const {BadRequestError, UnproccessableEntityError} = require('../errors');

const validator = require('email-validator');

module.exports = parameters => {
  const validKeys = ['email', 'username', 'firstname', 'lastname'];

  forEach(parameters, (value, key) => {
    if (size(parameters) !== 4 || !isString(value)) {
      throw new BadRequestError({message: 'There must be 4 parameters all of type string'});
    } else if (!validKeys.includes(key)) {
      throw new UnproccessableEntityError({message: 'Could not process unknown key'});
    }
  });

  if (!validator.validate(parameters.email)) {
    throw new BadRequestError({message: 'Invalid email address'});
  }
};
