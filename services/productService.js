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

module.exports = {
  saveProduct,
};
