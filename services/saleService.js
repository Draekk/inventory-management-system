const sequelize = require("../config/dbConfig");
const { NotFoundError, GenericError } = require("../errors/errorHandler");
const { Product, ProductSale } = require("../models");
const rep = require("../repositories/saleRepository");
const { updateProduct } = require("../repositories/productRepository");

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
 * @returns {Promise<Object|GenericError>} Retorna el objeto de la venta creada o un error en caso de falla.
 *
 * @throws {NotFoundError} Si no se encuentra alguno de los productos en la base de datos.
 * @throws {GenericError} Si ocurre un error al crear la venta o reducir el stock.
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
    return new GenericError("Error creando la venta.", err.message);
  }
};

/**
 * Reduce el stock de un producto y actualiza la base de datos.
 * Si el stock resulta ser negativo, lanza un error indicando que no hay suficiente inventario.
 *
 * @async
 * @function stockReduction
 * @param {Object} product - Objeto que representa el producto cuyo stock se va a reducir.
 * @param {number} product.stock - Stock actual del producto.
 * @param {number} quantity - Cantidad que se va a reducir del stock.
 * @param {Object} transaction - Objeto de transacción de Sequelize para asegurar la atomicidad de la operación.
 * @returns {Promise<void>}
 *
 * @throws {Error} Si el stock es insuficiente o si hay un error al actualizar el producto.
 */
const stockReduction = async (product, quantity, transaction) => {
  try {
    product.stock -= quantity;
    if (product.stock < 0) throw new Error("Stock insuficiente.");
    else {
      const affectedRows = await updateProduct(product, transaction);
      if (affectedRows < 1)
        throw new Error("Error al actualizar el stock del producto.");
    }
  } catch (err) {
    throw err;
  }
};

module.exports = {
  createSale,
};
