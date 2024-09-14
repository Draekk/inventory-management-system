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
 * Obtiene la lista completa de productos de la base de datos.
 *
 * @async
 * @function findProducts
 * @throws {Error} Lanza un error si no se pueden recuperar los productos.
 * @returns {Promise<Array<Object>>} Retorna una promesa que resuelve con un array de objetos que representan los productos.
 */
const findProducts = async () => {
  try {
    const data = await Product.findAll();
    return data;
  } catch (err) {
    throw err;
  }
};

/**
 * Obtiene un producto cuyo ID sea igual al ID enviado como argumento.
 *
 * @async
 * @function findProductById
 * @param {number} id - El ID del producto a buscar.
 * @returns {Promise<Object|null>} Retorna una promesa que resuelve con el producto encontrado o `null` si no se encuentra.
 * @throws {Error} Lanza un error si ocurre algún problema durante la búsqueda del producto.
 */
const findProductById = async (id) => {
  try {
    const data = await Product.findByPk(id);
    return data;
  } catch (err) {
    throw err;
  }
};

/**
 * Busca productos por su código de barras.
 *
 * @async
 * @function findProductByBarcode
 * @param {string} barcode - El código de barras del producto a buscar.
 * @returns {Promise<Array<Object>>} Retorna una promesa que resuelve con una lista de productos que coinciden con el código de barras.
 * @throws {Error} Lanza un error si ocurre algún problema durante la búsqueda.
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
    throw err;
  }
};

/**
 * Busca productos por nombre utilizando una coincidencia parcial.
 *
 * @async
 * @function findProductsByName
 * @param {string} name - El nombre (o parte del nombre) del producto a buscar.
 * @returns {Promise<Array<Object>>} - Retorna una promesa que resuelve con un array de productos que coinciden con el nombre dado.
 * @throws {Error} - Lanza un error si ocurre un problema durante la consulta a la base de datos.
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
    throw err;
  }
};

/**
 * Elimina un producto de la base de datos por su ID.
 *
 * @async
 * @function deleteProductById
 * @param {number} id - El ID del producto que se desea eliminar.
 * @returns {Promise<number>} - Retorna el número de filas afectadas por la eliminación.
 * @throws {Error} - Lanza un error si ocurre un problema durante la eliminación del producto.
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
    throw err;
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
 * @throws {Error} Si ocurre un error durante la eliminación del producto en la capa del repositorio.
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
    throw err;
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
