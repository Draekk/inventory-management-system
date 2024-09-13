const sequelize = require("../config/dbConfig");
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
 * Busca todas las ventas en la base de datos, opcionalmente incluyendo los productos relacionados, y limpia datos innecesarios.
 *
 * @async
 * @function findSales
 * @param {boolean} withProducts - Indica si se deben incluir los productos asociados a las ventas.
 * @returns {Promise<Object[]|GenericError>} Retorna una lista de ventas o un error si ocurre una falla.
 *
 * @throws {NotFoundError} Si no se encuentran ventas en la base de datos.
 * @throws {GenericError} Si ocurre un error durante la búsqueda de ventas en la base de datos.
 */
const findSales = async (withProducts) => {
  const t = await sequelize.transaction();
  try {
    const data = await rep.findSales(withProducts, t);
    if (Array.isArray(data)) {
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
    } else throw data;
  } catch (err) {
    await t.rollback();
    return new GenericError("Error encontrando ventas", err.message);
  }
};

/**
 * Busca una venta por su ID, opcionalmente incluyendo los productos asociados, y maneja la transacción.
 *
 * @async
 * @function findSaleById
 * @param {number} id - El ID de la venta a buscar.
 * @param {boolean} withProducts - Indica si se deben incluir los productos asociados a la venta.
 * @returns {Promise<Object|Error>} Devuelve la venta encontrada o lanza un error si no se encuentra.
 *
 * @throws {GenericError} Lanza un error si ocurre un fallo al buscar la venta o en la transacción.
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
  findSales,
  findSaleById,
};
