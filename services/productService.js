const rep = require("../repositories/productRepository");
const { Product } = require("../models");
const { GenericError, NotFoundError } = require("../errors/errorHandler");

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
    const data = await rep.saveProduct(product);
    return data;
  } catch (err) {
    return new GenericError("Error en la capa Servicios.", err.message);
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
    const oldProduct = await rep.findProductById(productDetail.id);
    if (!oldProduct)
      throw new NotFoundError(
        `No existe el producto con el ID: ${productDetail.id}.`
      );
    const product = Product.build(productDetail);
    const affectedRows = await rep.updateProduct(productDetail);
    if (affectedRows === 1) return product;
    throw new Error("No se efectuaron cambios en el producto");
  } catch (err) {
    if (err instanceof NotFoundError) return err;
    return new GenericError("Error en la capa Servicio.", err.message);
  }
};

/**
 * Obtiene una lista del repositorio con todos los productos de la base de datos.
 * @returns {Product[]|null} Una lista de productos o null si ocurre un error.
 */
const findProducts = async () => {
  try {
    const products = await rep.findProducts();
    if (products) return products;
    throw new NotFoundError("Productos no encontrados");
  } catch (err) {
    if (err instanceof NotFoundError) return err;
    return new GenericError("Error en la capa Servicio.", err.message);
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
    throw new NotFoundError(`No existe el producto con el ID: ${id}.`);
  } catch (err) {
    if (err instanceof NotFoundError) return err;
    return new GenericError("Error en la capa Servicio.", err.message);
  }
};

/**
 * Obtiene un producto que coincida con el `barcode` a buscar.
 * @param {string} barcode Código de barra del producto a buscar.
 * @returns {Product|null} El producto encontrado o error si no existe.
 */
const findProductByBarcode = async (barcode) => {
  try {
    const products = await rep.findProductByBarcode(barcode);
    if (products.length === 1) return products[0].toJSON();
    throw new NotFoundError(`No existe el producto con el código: ${barcode}.`);
  } catch (err) {
    if (err instanceof NotFoundError) return err;
    return new GenericError("Error en la capa Servicio.", err.message);
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
    if (products.length > 0) return products;
    throw new NotFoundError(`No existen productos con el nombre: ${name}.`);
  } catch (err) {
    if (err instanceof NotFoundError) return err;
    return new GenericError("Error en la capa Servicio.", err.message);
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
    if (affectedRows instanceof GenericError) throw affectedRows;
    if (affectedRows === 0)
      throw new NotFoundError(`No existe el producto con el ID: ${id}.`);
    return affectedRows;
  } catch (err) {
    if (err instanceof GenericError || err instanceof NotFoundError) return err;
    return new GenericError("Error en la capa Servicio.", err.message);
  }
};

/**
 * Elimina un producto de la base de datos utilizando su código de barras.
 *
 * @async
 * @function deleteProductByBarcode
 * @param {string} barcode - Código de barras del producto que se desea eliminar.
 * @returns {Promise<number|GenericError|NotFoundError>} Retorna el número de productos eliminados si la operación es exitosa, o un error si ocurre un fallo.
 *
 * @throws {GenericError} Si ocurre un error en la capa de servicio o en la capa de repositorio.
 * @throws {NotFoundError} Si el producto con el código de barras proporcionado no existe.
 */
const deleteProductByBarcode = async (barcode) => {
  try {
    const productsDeleted = await rep.deleteProductByBarcode(barcode);
    if (productsDeleted instanceof GenericError) throw productsDeleted;
    else if (productsDeleted === 0)
      throw new NotFoundError(
        `No existe el producto con el Código: ${barcode}.`
      );
    else return productsDeleted;
  } catch (err) {
    if (err instanceof GenericError || err instanceof NotFoundError) return err;
    return new GenericError("Error en la capa Servicio.", err.message);
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
