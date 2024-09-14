const rep = require("../repositories/productRepository");
const { Product } = require("../models");
const { NotFoundError, NotModifiedError } = require("../errors/errorhandler");

/**
 * Guarda un nuevo producto utilizando el repositorio.
 *
 * @async
 * @function saveProduct
 * @param {Object} productDetail - Detalles del producto que se va a guardar.
 * @param {string} productDetail.barcode - Código de barra único del producto.
 * @param {string} productDetail.name - Nombre del producto.
 * @param {number} productDetail.stock - Cantidad de stock disponible.
 * @param {number} productDetail.costPrice - Precio de costo del producto.
 * @param {number} productDetail.salePrice - Precio de venta del producto.
 * @throws {Error} Lanza un error si ocurre un problema al guardar el producto.
 *
 * @returns {Promise<Object>} El producto guardado si la operación es exitosa.
 */
const saveProduct = async (productDetail) => {
  try {
    const product = Product.build(productDetail);
    const data = await rep.saveProduct(product);
    return data;
  } catch (err) {
    throw err;
  }
};

/**
 * Crea un modelo Product con un ID y lo envía al repositorio.
 *
 * @async
 * @function updateProduct
 * @param {Object} productDetail - Detalles del producto a actualizar.
 * @param {number} productDetail.id - ID único del producto a actualizar.
 * @param {string} [productDetail.barcode] - Nuevo código de barra del producto.
 * @param {string} [productDetail.name] - Nuevo nombre del producto.
 * @param {number} [productDetail.stock] - Nuevo stock disponible del producto.
 * @param {number} [productDetail.costPrice] - Nuevo precio de costo del producto.
 * @param {number} [productDetail.salePrice] - Nuevo precio de venta del producto.
 * @throws {NotFoundError} Lanza un error si no se encuentra el producto con el ID especificado.
 * @throws {Error} Lanza un error si no se efectúan cambios en el producto.
 * @returns {Promise<Object>} Devuelve el objeto del producto actualizado si se realiza correctamente la actualización.
 */
const updateProduct = async (productDetail) => {
  try {
    const product = await rep.findProductById(productDetail.id);
    if (!product)
      throw new NotFoundError(
        `No existe el producto con el ID: ${productDetail.id}.`
      );
    const updatedProduct = Product.build(productDetail);
    const affectedRows = await rep.updateProduct(productDetail);
    if (affectedRows === 1) return updatedProduct;
    else throw new NotModifiedError("No se efectuaron cambios en el producto");
  } catch (err) {
    throw err;
  }
};

/**
 * Obtiene la lista de productos desde el repositorio. Lanza un error si la lista está vacía.
 *
 * @async
 * @function findProducts
 * @throws {NotFoundError} Lanza un error si no se encuentran productos.
 * @throws {Error} Lanza un error genérico si ocurre un problema al consultar los productos.
 * @returns {Promise<Array<Object>>} Retorna una promesa que resuelve con un array de productos si existen.
 */
const findProducts = async () => {
  try {
    const products = await rep.findProducts();
    if (products.length > 0) return products;
    else throw new NotFoundError("Lista de productos inexistente.");
  } catch (err) {
    throw err;
  }
};

/**
 * Busca un producto por su ID en el repositorio.
 *
 * @async
 * @function findProductById
 * @param {number} id - El ID del producto a buscar.
 * @throws {NotFoundError} Lanza un error si no se encuentra el producto con el ID especificado.
 * @throws {Error} Lanza un error genérico si ocurre un problema al consultar el producto.
 * @returns {Promise<Object>} Retorna una promesa que resuelve con el objeto del producto si se encuentra.
 */
const findProductById = async (id) => {
  try {
    const product = await rep.findProductById(id);
    if (product) return product;
    else throw new NotFoundError(`No existe el producto con el ID: ${id}.`);
  } catch (err) {
    throw err;
  }
};

/**
 * Busca un producto por su código de barras.
 *
 * @async
 * @function findProductByBarcode
 * @param {string} barcode - El código de barras del producto a buscar.
 * @returns {Promise<Object>} Retorna una promesa que resuelve con el producto encontrado.
 * @throws {NotFoundError} Lanza un error si no se encuentra ningún producto con el código de barras dado.
 * @throws {Error} Lanza un error si ocurre algún problema durante la búsqueda.
 */
const findProductByBarcode = async (barcode) => {
  try {
    const products = await rep.findProductByBarcode(barcode);
    if (products.length === 1) return products[0];
    else
      throw new NotFoundError(
        `No existe el producto con el código: ${barcode}.`
      );
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
 * @throws {NotFoundError} - Lanza un error si no se encuentran productos con el nombre dado.
 * @throws {Error} - Lanza un error si ocurre un problema durante la consulta a la base de datos.
 */

const findProductsByName = async (name) => {
  try {
    const products = await rep.findProductsByName(name);
    if (products.length > 0) return products;
    else
      throw new NotFoundError(`No existen productos con el nombre: ${name}.`);
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
 * @throws {NotFoundError} - Lanza un error si no se encuentra un producto con el ID especificado.
 * @throws {Error} - Lanza un error si ocurre un problema durante la eliminación del producto.
 */
const deleteProductById = async (id) => {
  try {
    const affectedRows = await rep.deleteProductById(id);
    if (affectedRows === 0)
      throw new NotFoundError(`No existe el producto con el ID: ${id}.`);
    return affectedRows;
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
 * @returns {Promise<number|GenericError|NotFoundError>} Retorna el número de productos eliminados si la operación es exitosa, o un error si ocurre un fallo.
 *
 * @throws {NotFoundError} Si el producto con el código de barras proporcionado no existe.
 */
const deleteProductByBarcode = async (barcode) => {
  try {
    const productsDeleted = await rep.deleteProductByBarcode(barcode);
    if (productsDeleted === 0)
      throw new NotFoundError(
        `No existe el producto con el Código: ${barcode}.`
      );
    else return productsDeleted;
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
