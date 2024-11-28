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
 * @returns {Promise<Object>} Retorna el objeto de la venta creada o un error si ocurre una falla.
 *
 * @throws {Error} Si ocurre un error al crear la venta en la base de datos.
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
    throw err;
  }
};

/**
 * Busca todas las ventas en la base de datos, opcionalmente incluyendo los productos relacionados.
 *
 * @async
 * @function findSales
 * @param {boolean} [withProducts=false] - Indica si se deben incluir los productos asociados a las ventas.
 * @param {Object} [transaction=null] - Objeto de transacción de Sequelize para asegurar la atomicidad de la operación (opcional).
 * @returns {Promise<Object[]>} Retorna una lista de ventas o un error si ocurre una falla.
 *
 * @throws {Error} Si ocurre un error al consultar las ventas en la base de datos.
 */
const findSales = async (withProducts = 0, transaction = null) => {
  try {
    let data = null;
    if (withProducts === 1) {
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

/**
 * Busca una venta por su ID, opcionalmente incluyendo los productos asociados.
 *
 * @async
 * @function findSaleById
 * @param {number} id - El ID de la venta a buscar.
 * @param {boolean} [withProducts=false] - Indica si se deben incluir los productos asociados a la venta.
 * @param {Object} [transaction=null] - La transacción de la base de datos en curso (opcional).
 * @returns {Promise<Object|null>} Devuelve la venta encontrada o `null` si no existe.
 *
 * @throws {Error} Lanza un error si ocurre un fallo al buscar la venta.
 */
const findSaleById = async (id, withProducts = false, transaction = null) => {
  try {
    let data = null;
    if (withProducts) {
      data = await Sale.findByPk(id, {
        include: [Product],
        transaction,
      });
    } else {
      data = await Sale.findByPk(id, {
        transaction,
      });
    }
    return data;
  } catch (err) {
    throw err;
  }
};

/**
 * Elimina una venta por su ID.
 *
 * @param {number} id - El ID de la venta a eliminar.
 * @returns {Promise<number>} - Una promesa que resuelve con el número de filas eliminadas.
 * @throws {Error} - Lanza un error si ocurre algún problema durante la eliminación.
 */
const deleteSaleById = async (id) => {
  try {
    const data = await Sale.destroy({
      where: {
        id,
      },
    });
    return data;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  createSale,
  findSales,
  findSaleById,
  deleteSaleById,
};
