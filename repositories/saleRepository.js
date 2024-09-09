const { GenericError } = require("../errors/errorHandler");
const { Sale } = require("../models");

/**
 * Crea un registro de venta en la base de datos.
 *
 * @async
 * @function createSale
 * @param {Object} saleData - Objeto con los datos de la venta.
 * @param {number} saleData.quantity - Cantidad de productos vendidos.
 * @param {number} saleData.total - Total de la venta.
 * @param {boolean} saleData.isCash - Indica si la venta fue en efectivo (true) o no (false).
 * @param {Object} [transaction=null] - Objeto de transacción de Sequelize para asegurar la atomicidad de la operación (opcional).
 * @returns {Promise<Object|GenericError>} Retorna el objeto de la venta creada o un error si ocurre una falla.
 *
 * @throws {GenericError} Si ocurre un error al crear la venta en la base de datos.
 */
const createSale = async ({ quantity, total, isCash }, transaction = null) => {
  try {
    const data = await Sale.create(
      {
        quantity,
        total,
        isCash,
      },
      {
        transaction,
      }
    );
    return data;
  } catch (err) {
    return new GenericError("Error en la capa Repositorio.", err.message);
  }
};

module.exports = {
  createSale,
};
