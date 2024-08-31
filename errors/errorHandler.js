class ValidationError extends Error {
  constructor(message, error = null) {
    super(message);
    this.name = "SequelizeUniqueConstraintError";
    this.error = error;
  }
}

class NotFoundError extends Error {
  constructor(message, error = null) {
    super(message);
    this.error = error;
    this.name = "No Encontrado";
  }
}

class GenericError extends Error {
  constructor(message, error = null) {
    super(message);
    this.error = error;
    this.name = "Error Genérico";
  }
}

class MiddlewareError extends Error {
  constructor(message, error = null) {
    super(message);
    this.error = error;
    this.name = "Error de Validación";
  }
}

module.exports = {
  ValidationError,
  GenericError,
  NotFoundError,
  MiddlewareError,
};
