class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
    this.status = 400;
    this.cause = message;
  }
}

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "NotFoundError";
    this.status = 404;
    this.cause = message;
  }
}

class UniqueConstraintError extends Error {
  constructor(message) {
    super(message);
    this.name = "UniqueConstraintError";
    this.status = 409;
    this.cause = message;
  }
}

class NotModifiedError extends Error {
  constructor(message) {
    super(message);
    this.name = "NotModifiedError";
    this.status = 400;
    this.cause = message;
  }
}

class NumberOutOfRangeError extends Error {
  constructor(message) {
    super(message);
    this.name = "NumberOutOfRangeError";
    this.status = 400;
    this.cause = message;
  }
}

module.exports = {
  ValidationError,
  NotFoundError,
  UniqueConstraintError,
  NotModifiedError,
  NumberOutOfRangeError,
};
