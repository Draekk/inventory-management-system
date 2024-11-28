const sequelize = require("../config/dbConfig");
const { Product, ProductSale } = require("../models");
const rep = require("../repositories/saleRepository");
const { updateProduct } = require("../repositories/productRepository");
const {
  NotFoundError,
  NumberOutOfRangeError,
  NotModifiedError,
} = require("../errors/errorhandler");

/**
 * Crea una venta en la base de datos, actualiza el stock de los productos vendidos y maneja la transacción.
 * Utiliza transacciones de Sequelize para asegurar la atomicidad de la operación.
 *
 * @async
 * @function createSale
 * @param {Object[]} saleItems - Lista de productos que se van a vender.
 * @param {number} saleItems[].id - ID del producto.
 * @param {number} saleItems[].quantity - Cantidad del producto vendido.
 * @param {boolean} isCash - Indica si la venta es en efectivo (true) o con otro método (false).
 * @returns {Promise<Object>} Retorna el objeto de la venta creada o un error en caso de falla.
 *
 * @throws {NotFoundError} Si no se encuentra alguno de los productos en la base de datos.
 * @throws {Error} Si ocurre un error al crear la venta o reducir el stock.
 */
const createSale = async (saleItems, isCash) => {
  const t = await sequelize.transaction();
  try {
    const products = await Promise.all(
      saleItems.map(async (item) => {
        const product = await Product.findByPk(item.id, { transaction: t });
        if (!product) throw new NotFoundError("Producto no encontrado.");
        await stockReduction(product, item.quantity, t);
        return {
          product,
          quantity: item.quantity,
          total: product.salePrice * item.quantity,
        };
      })
    );

    const saleTotal = products.reduce((total, item) => total + item.total, 0);

    const sale = await rep.createSale(
      {
        quantity: products.length,
        total: saleTotal,
        isCash,
      },
      t
    );

    const productsSales = await Promise.all(
      products.map((p) => ({
        ProductId: p.product.id,
        SaleId: sale.id,
      }))
    );

    await ProductSale.bulkCreate(productsSales, { transaction: t });
    await t.commit();
    return sale;
  } catch (err) {
    await t.rollback();
    throw err;
  }
};

/**
 * Busca todas las ventas en la base de datos, opcionalmente incluyendo los productos relacionados, y limpia datos innecesarios.
 *
 * @async
 * @function findSales
 * @param {boolean} withProducts - Indica si se deben incluir los productos asociados a las ventas.
 * @returns {Promise<Object[]>} Retorna una lista de ventas o un error si ocurre una falla.
 *
 * @throws {NotFoundError} Si no se encuentran ventas en la base de datos.
 * @throws {Error} Si ocurre un error durante la búsqueda de ventas en la base de datos.
 */
const findSales = async (withProducts) => {
  const t = await sequelize.transaction();
  try {
    const data = await rep.findSales(withProducts, t);
    if (data.length === 0) throw new NotFoundError("Lista de ventas vacía.");
    else {
      if (withProducts) {
        data.forEach((sale) => {
          sale.dataValues.Products.forEach((p) => {
            delete p.dataValues.products_sales;
          });
        });
      }

      await t.commit();
      return data;
    }
  } catch (err) {
    await t.rollback();
    throw err;
  }
};

/**
 * Busca una venta por su ID, con opción de incluir productos asociados, y maneja la transacción de la base de datos.
 *
 * @async
 * @function findSaleById
 * @param {number} id - El ID de la venta que se desea buscar.
 * @param {boolean} withProducts - Indica si se deben incluir los productos asociados a la venta.
 * @returns {Promise<Object>} - Una promesa que se resuelve con la venta encontrada, incluyendo los productos si se solicitó.
 * @throws {NotFoundError} - Lanza un error si la venta con el ID proporcionado no se encuentra.
 * @throws {Error} - Lanza un error si ocurre un problema durante la búsqueda o al manejar la transacción.
 */
const findSaleById = async (id, withProducts) => {
  const t = await sequelize.transaction();

  try {
    const data = await rep.findSaleById(id, withProducts, t);
    if (!data) throw new NotFoundError(`El ID de venta ${id} no existe.`);
    else {
      if (withProducts) {
        data.dataValues.Products.forEach((p) => {
          delete p.dataValues.products_sales;
        });
      }

      await t.commit();
      return data;
    }
  } catch (err) {
    await t.rollback();
    throw err;
  }
};

/**
 * Elimina una venta por su ID.
 *
 * @async
 * @function deleteSaleById
 * @param {number} id - El ID de la venta a eliminar.
 * @returns {Promise<number>} - Una promesa que se resuelve con el número de filas eliminadas.
 * @throws {NotFoundError} - Lanza un error si no se encuentra la venta a eliminar.
 * @throws {Error} - Lanza un error si ocurre un problema durante la eliminación.
 */
const deleteSaleById = async (id) => {
  try {
    const data = await rep.deleteSaleById(id);
    if (data < 1)
      throw new NotFoundError("No se encontró la venta a eliminar.");
    return data;
  } catch (err) {
    throw err;
  }
};

/**
 * Reduce el stock de un producto y actualiza el registro en la base de datos.
 *
 * @async
 * @function stockReduction
 * @param {Object} product - El objeto del producto cuyo stock se va a reducir.
 * @param {number} quantity - La cantidad a reducir del stock del producto.
 * @param {Object} transaction - La transacción de Sequelize para asegurar la atomicidad de la operación.
 * @returns {Promise<void>} - Una promesa que se resuelve cuando la reducción del stock se completa con éxito.
 * @throws {NumberOutOfRangeError} - Si el stock del producto queda por debajo de 0.
 * @throws {NotModifiedError} - Si no se logró actualizar el stock del producto en la base de datos.
 */
const stockReduction = async (product, quantity, transaction) => {
  try {
    product.stock -= quantity;
    if (product.stock < 0)
      throw new NumberOutOfRangeError(
        "No se pudo crear la venta. Stock insuficiente."
      );
    else {
      const affectedRows = await updateProduct(product, transaction);
      if (affectedRows < 1)
        throw new NotModifiedError(
          "Error al actualizar el stock del producto."
        );
    }
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
