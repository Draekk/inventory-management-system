/**
 * Crea una respuesta con datos personalizados.
 * @param {string} message Mensaje de la respuesta.
 * @param {boolean} success Si la respuesta es exitosa.
 * @param {Object} data Objeto a enviar dentro de la respuesta.
 * @param {boolean} error Si ocurrió un error.
 * @returns {Object}
 */
const createResponse = (
  message,
  success = false,
  data = null,
  error = false
) => {
  if (error) {
    return {
      error,
      message,
    };
  }
  return {
    success,
    message,
    data,
  };
};

module.exports = {
  createResponse,
};
