class ValidationError extends Error {
  constructor(message, error) {
    super(message);
    this.name = "SequelizeUniqueConstraintError";
    this.error = error;
  }
}

class GenericError extends Error {
  constructor(message, error) {
    super(message);
    this.error = error;
    this.name = "Error Genérico";
  }
}

module.exports = {
  ValidationError,
  GenericError,
};
