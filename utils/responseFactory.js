/**
 * Crea una respuesta con datos personalizados.
 * @param {string} message Mensaje de la respuesta.
 * @param {Object} data Objeto a enviar dentro de la respuesta.
 * @returns {Object}
 */
const createRes = (message, data = null) => {
  return {
    success: true,
    message,
    data,
  };
};

/**
 * Crea una respuesta con un error.
 * @param {Object} error Error que se enviará como propiedad
 * @returns {Object}
 */
const createBadRes = (error) => {
  return {
    success: false,
    error: error,
  };
};

module.exports = {
  createRes,
  createBadRes,
};
