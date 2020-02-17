'use strict';

class DomainError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

class ResourceNotFoundError extends DomainError {
  constructor(error) {
    super(error.message);
    this.data = {
      code: 404,
      message: error.message,
      diagnostic: 'Resource Not Found',
    };
  }
}

class BadRequestError extends DomainError {
  constructor(error) {
    super(error.message);
    this.data = {
      code: 400,
      message: error.message,
      diagnostic: 'Bad Request',
    };
  }
}

class UnproccessableEntityError extends DomainError {
  constructor(error) {
    super(error.message);
    this.data = {
      code: 422,
      message: error.message,
      diagnostic: 'Unproccessable Entity',
    };
  }
}

module.exports = {
  UnproccessableEntityError,
  ResourceNotFoundError,
  BadRequestError,
};
