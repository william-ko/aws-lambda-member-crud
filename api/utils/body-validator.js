const {forEach, isString, size} = require('lodash');
const {BadRequestError, UnproccessableEntityError} = require('../errors');

const validator = require('email-validator');

const validateEmail = email => {
  if (!validator.validate(email)) {
    throw new BadRequestError({message: 'Invalid email address'});
  }
}

module.exports = (parameters, method) => {
  // validates request body depending on the method (POST, PUT)
  let maxValues;
  let email;
  let validKeys;;

  if (method === 'PUT') {
    validKeys = ['parameterName', 'parameterValue'];
    maxValues = 2;

    if (parameters.parameterName === 'email') {
      email = parameters.parameterValue;
    }
  } else {
    validKeys = ['email', 'username', 'firstname', 'lastname'];
    maxValues = 4;
    email = parameters.email;
  }

  forEach(parameters, (value, key) => {
    if (size(parameters) !== maxValues || !isString(value)) {
      throw new BadRequestError({message: `There must be ${maxValues} parameters all of type string`});
    } else if (!validKeys.includes(key)) {
      throw new UnproccessableEntityError({message: 'Could not process unknown key'});
    }
  });

  if (email) validateEmail(email);
};
