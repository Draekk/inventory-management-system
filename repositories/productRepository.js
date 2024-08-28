const { Op } = require("sequelize");
const { Product } = require("../models");
const {
  ValidationError,
  GenericError,
  NotFoundError,
} = require("../errors/errorHandler");

/**
 * Guarda un nuevo producto en la base de datos
 * @param { Product } product - Propiedades del producto.
 * @param { string } product.barcode - Código de barra del producto.
 * @param { string } product.name - Nombre del producto.
 * @param { number } product.stock - Cantidad disponible del producto.
 * @param { number } product.costPrice - Precio de costo del producto.
 * @param { number } product.salePrice - Precio de venta del producto.
 * @returns { Promise<Product|null> } El producto creado o null si ocurre un error.
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
      return new ValidationError(
        "Error: el barcode debe ser único",
        err.message
      );
    }
    return new GenericError("Error en la capa Repositorio.", err);
  }
};

/**
 * Actualiza un producto existente en la base de datos.
 * @param { Product } product - Propiedades del producto.
 * @param { number } product.id - ID del producto.
 * @param { string } product.barcode - Código de barra del producto.
 * @param { string } product.name - Nombre del producto.
 * @param { number } product.stock - Cantidad disponible del producto.
 * @param { number } product.costPrice - Precio de costo del producto.
 * @param { number } product.salePrice - Precio de venta del producto.
 * @returns { Promise<number|null> } Un arreglo con el numero de filas afectadas.
 */
const updateProduct = async ({
  id,
  barcode,
  name,
  stock,
  costPrice,
  salePrice,
}) => {
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
      }
    );
    return data[0];
  } catch (err) {
    return new GenericError("Error en la capa Repositorio.", err.message);
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

module.exports = {
  saveProduct,
  updateProduct,
  findProducts,
  findProductById,
  findProductsByName,
  deleteProductById,
};
