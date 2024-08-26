const { Op } = require("sequelize");
const { Product } = require("../models");

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

    return data;
  } catch (err) {
    console.error("Error al crear el producto:", err);
    return null;
  }
};

/**
 * Actualiza un producto existente en la base de datos
 * @param { Product } product - Propiedades del producto.
 * @param { number } product.id - ID del producto.
 * @param { string } product.barcode - Código de barra del producto.
 * @param { string } product.name - Nombre del producto.
 * @param { number } product.stock - Cantidad disponible del producto.
 * @param { number } product.costPrice - Precio de costo del producto.
 * @param { number } product.salePrice - Precio de venta del producto.
 * @returns { [number] } Un arreglo con el numero de filas afectadas.
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

    return data;
  } catch (err) {
    console.error("Error al actualizar el producto:", err);
    return null;
  }
};

/**
 * Obtiene una lista de todos los productos de la base de datos
 * @returns {Promise<Product[]>} Una promesa con una lista de productos
 */
const findProducts = async () => {
  try {
    const data = await Product.findAll();
    return data;
  } catch (err) {
    console.error("Error al obtener los productos:", err);
    return null;
  }
};

module.exports = {
  saveProduct,
  updateProduct,
  findProducts,
};
