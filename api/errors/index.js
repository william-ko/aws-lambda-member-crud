class DomainError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

class ResourceNotFoundError extends DomainError {
  constructor(resource) {
    super(`Resource ${resource} was not found.`);
    this.data = {
      code: 404,
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

class InternalError extends DomainError {
  constructor(error) {
    super(error.message);
    this.data = {error};
  }
}

module.exports = {
  UnproccessableEntityError,
  ResourceNotFoundError,
  BadRequestError,
  InternalError,
};
