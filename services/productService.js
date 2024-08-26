const rep = require("../repositories/productRepository");
const { Product } = require("../models");

/**
 * Crea un nuevo modelo Product y lo envía al repositorio.
 * @param {Object} productDetail Objeto con los parametros del producto.
 * @param {string} productDetail.barcode Código de barra del producto.
 * @param {string} productDetail.name Nombre del producto.
 * @param {number} productDetail.stock Cantidad disponible del producto.
 * @param {number} productDetail.costPrice Precio de costo del producto.
 * @param {number} productDetail.salePrice Precio de venta del producto.
 * @returns {Object|null} Un objeto con las propiedades del producto creado, o null si ocurrió un error.
 */
const saveProduct = async (productDetail) => {
  try {
    const product = Product.build(productDetail);
    const savedProduct = await rep.saveProduct(product);
    return savedProduct.toJSON();
  } catch (err) {
    console.error("Error desde el servicio - saveProduct:", err);
    return null;
  }
};

/**
 * Crea un modelo Product con un ID y lo envía al repositorio.
 * @param {Object} productDetail Objeto con los parametros del producto.
 * @param {number} productDetail.id ID del producto a modificar.
 * @param {string} productDetail.barcode Código de barra del producto.
 * @param {string} productDetail.name Nombre del producto.
 * @param {number} productDetail.stock Cantidad disponible del producto.
 * @param {number} productDetail.costPrice Precio de costo del producto.
 * @param {number} productDetail.salePrice Precio de venta del producto.
 * @returns {Object|null} Un objeto con las propiedades del producto actualizado, o null si ocurrió un error.
 */
const updateProduct = async (productDetail) => {
  try {
    const product = Product.build(productDetail);
    const affectedRows = await rep.updateProduct(productDetail);
    if (affectedRows[0] === 1) return product.toJSON();
    return null;
  } catch (err) {
    console.error("Error desde el servicio - updateProduct:", err);
    return null;
  }
};

/**
 * Obtiene una lista del repositorio con todos los productos de la base de datos.
 * @returns {Product[]|null} Una lista de productos o null si ocurre un error.
 */
const findProducts = async () => {
  try {
    const products = await rep.findProducts();
    console.debug(products);
    if (products) return products;
    return null;
  } catch (err) {
    console.error("Error desde el servicio - findProducts:", err);
    return null;
  }
};

module.exports = {
  saveProduct,
  updateProduct,
  findProducts,
};
