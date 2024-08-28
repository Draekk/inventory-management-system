const { GenericError, NotFoundError } = require("../errors/errorHandler");
const serv = require("../services/productService");
const { createRes, createBadRes } = require("../utils/responseFactory");

/**
 * Guarda un nuevo producto utilizando el servicio y devuelve una respuesta JSON.
 *
 * @param {Object} req - El objeto de solicitud.
 * @param {Object} req.body - El cuerpo de la solicitud que contiene los datos del producto.
 * @param {Object} res - El objeto de respuesta.
 * @returns {Promise<Object>} - Una respuesta JSON que contiene el producto creado o un mensaje de error.
 */
const saveProduct = async (req, res) => {
  try {
    const product = req.body;
    const data = await serv.saveProduct(product);
    console.log(data);
    if (data.hasOwnProperty("error"))
      return res.status(500).json(createBadRes(data));
    else
      return res
        .status(202)
        .json(createRes("Producto creado exitósamente", data));
  } catch (err) {
    return res
      .status(500)
      .json(
        createBadRes(
          new GenericError("Error en la capa Controladora:", err.message)
        )
      );
  }
};

/**
 * Obtiene una lista de productos del servicio y los devuelve como un JSON dentro de la respuesta.
 *
 * @param {Object} req - El objeto de solicitud.
 * @param {Object} res - El objeto de respuesta.
 * @returns {Promise<Object>} - Una respuesta JSON que contiene los productos encontrados o un mensaje de error.
 */
const updateProduct = async (req, res) => {
  try {
    const product = req.body;
    const data = await serv.updateProduct(product);
    if (data instanceof NotFoundError)
      return res.status(404).json(createBadRes(data));
    else if (data instanceof GenericError)
      return res.status(500).json(createBadRes(data));
    return res
      .status(202)
      .json(createRes("Producto actualizado correctamente.", data));
  } catch (err) {
    return res
      .status(500)
      .json(
        createBadRes(
          new GenericError("Error en la capa Controladora", err.message)
        )
      );
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
    if (data instanceof NotFoundError)
      return res.status(404).json(createBadRes(data));
    else if (data instanceof GenericError)
      return res.status(500).json(createBadRes(data));
    return res.status(200).json(createRes("Productos encontrados", data));
  } catch (err) {
    return res
      .status(500)
      .json(
        createBadRes(
          new GenericError("Error en la capa Controladora.", err.message)
        )
      );
  }
};

/**
 * Extrae un valor `id` del request y lo envía al servicio,
 * si el `id` existe en la base de datos, obtendrá un producto y lo
 * enviará como respuesta.
 *
 * @param {Object} req - El objeto de solicitud.
 * @param {Object} req.params - Los parámetros de la solicitud.
 * @param {string} req.params.id - El ID del producto a buscar.
 * @param {Object} res - El objeto de respuesta.
 * @returns {Promise<Object>} - Una respuesta JSON que contiene el producto encontrado o un mensaje de error.
 */
const findProductById = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await serv.findProductById(id);
    if (data instanceof NotFoundError)
      return res.status(404).json(createBadRes(data));
    else if (data instanceof GenericError)
      return res.status(500).json(createBadRes(data));
    return res.status(200).json(createRes("Producto encontrado.", data));
  } catch (err) {
    return res
      .status(500)
      .json(
        createBadRes(
          new GenericError("Error en la capa Controladora.", err.message)
        )
      );
  }
};

/**
 * Encuentra productos por su nombre y los devuelve en la respuesta.
 *
 * @param {Object} req - El objeto de solicitud.
 * @param {Object} req.params - Los parámetros de la solicitud.
 * @param {string} req.params.name - El nombre del producto a buscar.
 * @param {Object} res - El objeto de respuesta.
 * @returns {Promise<Object>} - Una respuesta JSON que contiene los productos encontrados o un mensaje de error.
 */
const findProductsByName = async (req, res) => {
  try {
    const name = req.params.name;
    const data = await serv.findProductsByName(name);
    if (data instanceof NotFoundError)
      return res.status(404).json(createBadRes(data));
    else if (data instanceof GenericError)
      return res.status(500).json(createBadRes(data));
    return res
      .status(200)
      .json(createRes(`Productos encontrados con el nombre: ${name}.`, data));
  } catch (err) {
    return res
      .status(500)
      .json(
        createBadRes(
          new GenericError("Error en la capa Controladora.", err.message)
        )
      );
  }
};

/**
 * Elimina un producto de la base de datos basado en su ID.
 *
 * @param {Object} req - Objeto de solicitud (Request) de Express.
 * @param {Object} req.params - Objeto que contiene los parámetros de la solicitud.
 * @param {string} req.params.id - ID del producto que se desea eliminar.
 * @param {Object} res - Objeto de respuesta (Response) de Express.
 * @returns {Promise<void>} Retorna una respuesta HTTP con el resultado de la operación.
 */
const deleteProductById = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await serv.deleteProductById(id);
    if (data instanceof NotFoundError)
      return res.status(404).json(createBadRes(data));
    else if (data instanceof GenericError)
      return res.status(500).json(createBadRes(data));
    return res
      .status(200)
      .json(createRes(`Eliminado el producto con el ID: ${id}.`));
  } catch (err) {
    return res
      .status(500)
      .json(
        createBadRes(
          new GenericError("Error en la capa Controladora.", err.message)
        )
      );
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
