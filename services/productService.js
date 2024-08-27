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
    if (affectedRows === 1) return product;
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

/**
 * Obtiene un producto cuyo ID sea igual al ID enviado como argumento al repositorio.
 * @param {number} id ID del producto a buscar.
 * @returns {Product|null} El producto encontrado o null si ocurre un error.
 */
const findProductById = async (id) => {
  try {
    const product = await rep.findProductById(id);
    if (product) return product.toJSON();
    return null;
  } catch (err) {
    console.error("Error desde el servicio - findProductById:", err);
    return null;
  }
};

/**
 * Obtiene una lista con los productos con nombre similar al nombre otorgado como argumento desde el repositorio.
 * @param {string} name Nombre de los productos a buscar.
 * @returns {Product[]|null} Una lista de productos encontrados o null si ocurre un error.
 */
const findProductsByName = async (name) => {
  try {
    const products = await rep.findProductsByName(name);
    if (products) return products;
    return null;
  } catch (err) {
    console.error("Error desde el servicio - findProductsByName:", err);
    return null;
  }
};

/**
 * Elimina un producto con el ID igual al ID que se le otorga como argumento.
 * @param {number} id ID del producto a eliminar.
 * @returns {number} El numero de filas afectadas o null si ocurre un error.
 */
const deleteProductById = async (id) => {
  try {
    const affectedRows = await rep.deleteProductById(id);
    return affectedRows;
  } catch (err) {
    console.error("Error desde el servicio - deleteProductById:", err);
    return 0;
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
