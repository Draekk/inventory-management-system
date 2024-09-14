const serv = require("../services/productService");
const { createRes, createBadRes } = require("../utils/responseFactory");

/**
 * Controlador para crear un nuevo producto en la base de datos.
 *
 * @async
 * @function saveProduct
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} req.body - Contiene los detalles del producto a crear.
 * @param {string} req.body.barcode - Código de barras del producto.
 * @param {string} req.body.name - Nombre del producto.
 * @param {number} req.body.stock - Stock inicial del producto.
 * @param {number} req.body.costPrice - Precio de costo del producto.
 * @param {number} req.body.salePrice - Precio de venta del producto.
 * @param {Object} res - Objeto de respuesta de Express.
 * @throws {Error} Lanza un error si no se puede crear el producto.
 * @returns {Promise<Object>} Devuelve una respuesta JSON con el mensaje de éxito y los datos del producto creado.
 */
const saveProduct = async (req, res) => {
  try {
    const { barcode, name, stock, costPrice, salePrice } = req.body;
    const data = await serv.saveProduct({
      barcode,
      name,
      stock,
      costPrice,
      salePrice,
    });
    console.log(data);
    if (data)
      return res
        .status(201)
        .json(createRes("Producto creado exitósamente", data));
    else throw new Error("Error al crear el producto.");
  } catch (err) {
    if (err.status) return res.status(err.status).json(createBadRes(err));
    else return res.status(500).json(createBadRes(err.message));
  }
};

/**
 * Controlador para actualizar un producto en la base de datos.
 *
 * @async
 * @function updateProduct
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} req.body - Contiene los detalles del producto a actualizar.
 * @param {number} req.body.id - ID único del producto a actualizar.
 * @param {string} [req.body.barcode] - Nuevo código de barra del producto.
 * @param {string} [req.body.name] - Nuevo nombre del producto.
 * @param {number} [req.body.stock] - Nuevo stock disponible del producto.
 * @param {number} [req.body.costPrice] - Nuevo precio de costo del producto.
 * @param {number} [req.body.salePrice] - Nuevo precio de venta del producto.
 * @param {Object} res - Objeto de respuesta de Express.
 * @throws {Error} Lanza un error si no se puede actualizar el producto o si la actualización falla.
 * @returns {Promise<Object>} Devuelve una respuesta JSON con el mensaje de éxito y los datos del producto actualizado.
 */
const updateProduct = async (req, res) => {
  try {
    const product = req.body;
    const data = await serv.updateProduct(product);
    if (data)
      return res
        .status(200)
        .json(createRes("Producto actualizado correctamente.", data));
    else throw new Error("Error al actualizar el producto.");
  } catch (err) {
    if (err.status) return res.status(err.status).json(createBadRes(err));
    else return res.status(500).json(createBadRes(err.message));
  }
};

/**
 * Obtiene una lista de productos del servicio y los devuelve como un JSON dentro de la respuesta.
 *
 * @param {Object} req - El objeto de solicitud.
 * @param {Object} res - El objeto de respuesta.
 * @returns {Promise<Object>} - Una respuesta JSON que contiene los productos encontrados o un mensaje de error.
 */
const findProducts = async (req, res) => {
  try {
    const data = await serv.findProducts();
    return res
      .status(200)
      .json(createRes("Productos encontrados correctamente.", data));
  } catch (err) {
    if (err.status) return res.status(err.status).json(createBadRes(err));
    else return res.status(500).json(createBadRes(err.message));
  }
};

/**
 * Controlador para buscar un producto por su ID.
 *
 * @async
 * @function findProductById
 * @param {Object} req - Objeto de solicitud (Request) de Express.
 * @param {Object} res - Objeto de respuesta (Response) de Express.
 * @param {Object} req.params - Los parámetros de la URL.
 * @param {string} req.params.id - El ID del producto a buscar.
 * @returns {Promise<Object>} Retorna una respuesta JSON con el producto encontrado o un error.
 */
const findProductById = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await serv.findProductById(id);
    return res
      .status(200)
      .json(createRes(`Se encontró el producto con ID: ${id}`, data));
  } catch (err) {
    if (err.status) return res.status(err.status).json(createBadRes(err));
    else return res.status(500).json(createBadRes(err.message));
  }
};

/**
 * Controlador para buscar un producto por su código de barras.
 *
 * @async
 * @function findProductByBarcode
 * @param {Object} req - El objeto de solicitud (request) de Express.
 * @param {Object} req.params - Los parámetros de la URL.
 * @param {string} req.params.barcode - El código de barras del producto a buscar.
 * @param {Object} res - El objeto de respuesta (response) de Express.
 * @returns {Promise<Object|void>} Retorna una promesa que resuelve con la respuesta enviada al cliente.
 * @throws {NotFoundError} Lanza un error si no se encuentra un producto con el código de barras dado.
 */
const findProductByBarcode = async (req, res) => {
  try {
    const barcode = req.params.barcode;
    const data = await serv.findProductByBarcode(barcode);
    return res
      .status(200)
      .json(
        createRes(`Se encontró el producto con el Código: ${barcode}.`, data)
      );
  } catch (err) {
    if (err.status) return res.status(err.status).json(createBadRes(err));
    else return res.status(500).json(createBadRes(err.message));
  }
};

/**
 * Controlador para buscar productos por nombre utilizando una coincidencia parcial.
 *
 * @async
 * @function findProductsByName
 * @param {Object} req - El objeto de solicitud de Express.
 * @param {Object} req.params - Los parámetros de la URL.
 * @param {string} req.params.name - El nombre (o parte del nombre) del producto a buscar.
 * @param {Object} res - El objeto de respuesta de Express.
 * @returns {Promise<Object>} - Retorna una respuesta JSON con un mensaje y los productos encontrados.
 * @throws {Error} - Lanza un error si ocurre un problema durante la búsqueda de productos o al enviar la respuesta.
 */
const findProductsByName = async (req, res) => {
  try {
    const name = req.params.name;
    const data = await serv.findProductsByName(name);
    return res
      .status(200)
      .json(
        createRes(`Se encontraron productos con el nombre: ${name}.`, data)
      );
  } catch (err) {
    if (err.status) return res.status(err.status).json(createBadRes(err));
    else return res.status(500).json(createBadRes(err.message));
  }
};

/**
 * Controlador para eliminar un producto por su ID.
 *
 * @async
 * @function deleteProductById
 * @param {Object} req - El objeto de solicitud HTTP.
 * @param {Object} req.params - Los parámetros de la solicitud.
 * @param {string} req.params.id - El ID del producto a eliminar.
 * @param {Object} res - El objeto de respuesta HTTP.
 * @returns {Object} - Respuesta HTTP con el estado de la operación de eliminación.
 * @throws {Object} - Retorna un objeto JSON con un mensaje de error si ocurre un problema.
 */
const deleteProductById = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await serv.deleteProductById(id);
    return res
      .status(200)
      .json(createRes(`Se eliminó el producto con ID: ${id}.`));
  } catch (err) {
    if (err.status) return res.status(err.status).json(createBadRes(err));
    else return res.status(500).json(createBadRes(err.message));
  }
};

/**
 * Elimina un producto de la base de datos utilizando su código de barras, obteniendo el código desde los parámetros de la solicitud.
 *
 * @async
 * @function deleteProductByBarcode
 * @param {Object} req - Objeto de solicitud (Request) de Express.
 * @param {Object} req.params - Contiene los parámetros de la solicitud.
 * @param {string} req.params.barcode - Código de barras del producto que se desea eliminar.
 * @param {Object} res - Objeto de respuesta (Response) de Express.
 * @returns {Promise<void>} Retorna una respuesta HTTP con el resultado de la operación.
 *
 * @throws {NotFoundError} Si no se encuentra un producto con el código de barras proporcionado.
 */
const deleteProductByBarcode = async (req, res) => {
  try {
    const barcode = req.params.barcode;
    const data = await serv.deleteProductByBarcode(barcode);
    return res
      .status(200)
      .json(createRes(`Se eliminó el producto con el Código: ${barcode}.`));
  } catch (err) {
    if (err.status) return res.status(err.status).json(createBadRes(err));
    else return res.status(500).json(createBadRes(err.message));
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
