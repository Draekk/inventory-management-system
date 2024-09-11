const { GenericError } = require("../errors/errorHandler");
const { Sale, Product, ProductSale } = require("../models");

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

/**
 * Busca todas las ventas en la base de datos, opcionalmente incluyendo los productos relacionados.
 *
 * @async
 * @function findSales
 * @param {boolean} [withProducts=false] - Indica si se deben incluir los productos asociados a las ventas.
 * @param {Object} [transaction=null] - Objeto de transacción de Sequelize para asegurar la atomicidad de la operación (opcional).
 * @returns {Promise<Object[]|GenericError>} Retorna una lista de ventas o un error si ocurre una falla.
 *
 * @throws {GenericError} Si ocurre un error al consultar las ventas en la base de datos.
 */
const findSales = async (withProducts = false, transaction = null) => {
  try {
    let data = null;
    if (withProducts) {
      data = await Sale.findAll({
        include: [Product],
        transaction,
      });
    } else {
      data = await Sale.findAll({
        transaction,
      });
    }
    return data;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  createSale,
  findSales,
};
