const { Op } = require("sequelize");
const { Product } = require("../models");
const { UniqueConstraintError } = require("../errors/errorhandler");

/**
 * Guarda un nuevo producto en la base de datos.
 *
 * @async
 * @function saveProduct
 * @param {Object} product - Objeto que contiene los datos del producto.
 * @param {string} product.barcode - Código de barra único del producto.
 * @param {string} product.name - Nombre del producto.
 * @param {number} product.stock - Cantidad de stock disponible.
 * @param {number} product.costPrice - Precio de costo del producto.
 * @param {number} product.salePrice - Precio de venta del producto.
 * @throws {UniqueConstraintError} Lanza un error si el código de barra ya existe en la base de datos.
 * @throws {Error} Lanza un error si ocurre un problema inesperado durante la creación.
 *
 * @returns {Promise<Object>} El producto creado si la operación es exitosa.
 */
const saveProduct = async ({ barcode, name, stock, costPrice, salePrice }) => {
  try {
    const data = await Product.create({
      barcode,
      name,
      stock,
      costPrice,
      salePrice,
    });

    if (data) return data;
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      throw new UniqueConstraintError(
        "El producto ya existe. Violación de restrición única."
      );
    }
    throw err;
  }
};

/**
 * Actualiza los detalles de un producto en la base de datos.
 *
 * @async
 * @function updateProduct
 * @param {Object} productDetails - Detalles del producto a actualizar.
 * @param {number} productDetails.id - ID único del producto a actualizar.
 * @param {string} productDetails.barcode - Nuevo código de barra del producto.
 * @param {string} productDetails.name - Nuevo nombre del producto.
 * @param {number} productDetails.stock - Nuevo stock disponible del producto.
 * @param {number} productDetails.costPrice - Nuevo precio de costo del producto.
 * @param {number} productDetails.salePrice - Nuevo precio de venta del producto.
 * @param {Object} [transaction=null] - Transacción Sequelize opcional para la operación.
 * @throws {UniqueConstraintError} Lanza un error si hay una violación de restricción única.
 * @throws {Error} Lanza un error si ocurre un problema inesperado durante la actualización.
 *
 * @returns {Promise<number>} Número de filas afectadas por la operación de actualización.
 */
const updateProduct = async (
  { id, barcode, name, stock, costPrice, salePrice },
  transaction = null
) => {
  try {
    const data = await Product.update(
      {
        barcode,
        name,
        stock,
        costPrice,
        salePrice,
      },
      {
        where: {
          id,
        },
        transaction,
      }
    );
    return data[0];
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      throw new UniqueConstraintError(
        "El producto ya existe. Violación de restrición única."
      );
    }
    throw err;
  }
};

/**
 * Obtiene una lista de todos los productos de la base de datos.
 * @returns {Promise<Product[]|null>} Una promesa con una lista de productos o null si ocurre un error.
 */
const findProducts = async () => {
  try {
    const data = await Product.findAll();
    return data;
  } catch (err) {
    return new GenericError("Error en la capa Repositorio.", err.message);
  }
};

/**
 * Obtiene un producto cuyo ID sea igual al ID enviado como argumento.
 * @param {number} id ID del producto a buscar.
 * @returns {Promise<Product|null>} El producto encontrado o null si ocurre un error.
 */
const findProductById = async (id) => {
  try {
    const data = await Product.findByPk(id);
    return data;
  } catch (err) {
    return new GenericError("Error en la capa Repositorio", err.message);
  }
};

/**
 * Obtiene un producto de la base de datos que coincidad con el `barcode`
 * @param {string} barcode Código de barra del producto a buscar
 * @returns {Promise<Product[]|null>} El producto encontrado o un error si ocurre.
 */
const findProductByBarcode = async (barcode) => {
  try {
    const data = await Product.findAll({
      where: {
        barcode,
      },
    });
    return data;
  } catch (err) {
    return new GenericError("Error en la capa Repositorio.", err.message);
  }
};

/**
 * Obtiene una lista con los productos con nombre similar al nombre otorgado como argumento.
 * @param {string} name Nombre de los productos a buscar.
 * @returns {Promise<Product[]|null>} Una lista de productos encontrados o null si ocurre un error.
 */
const findProductsByName = async (name) => {
  try {
    const data = await Product.findAll({
      where: {
        name: {
          [Op.substring]: name,
        },
      },
    });
    return data;
  } catch (err) {
    return new GenericError("Error en la capa Repositorio.", err.message);
  }
};

/**
 * Elimina un producto con el ID igual al ID que se le otorga como argumento.
 * @param {number} id ID del producto a eliminar.
 * @returns {number} El numero de filas afectadas o null si ocurre un error.
 */
const deleteProductById = async (id) => {
  try {
    const data = await Product.destroy({
      where: {
        id,
      },
    });
    return data;
  } catch (err) {
    return new GenericError("Error en la capa Repositorio.", err.message);
  }
};

/**
 * Elimina un producto de la base de datos utilizando su código de barras.
 *
 * @async
 * @function deleteProductByBarcode
 * @param {string} barcode - Código de barras del producto que se desea eliminar.
 * @returns {Promise<number|GenericError>} Retorna el número de productos eliminados si la operación es exitosa, o un error si ocurre un fallo.
 *
 * @throws {GenericError} Si ocurre un error durante la eliminación del producto en la capa del repositorio.
 */
const deleteProductByBarcode = async (barcode) => {
  try {
    const data = await Product.destroy({
      where: {
        barcode,
      },
    });
    return data;
  } catch (err) {
    return new GenericError("Error en la capa Repositorio.", err.message);
  }
};

module.exports = {
  saveProduct,
  updateProduct,
  findProducts,
  findProductById,
  findProductByBarcode,
  findProductsByName,
  deleteProductById,
  deleteProductByBarcode,
};
