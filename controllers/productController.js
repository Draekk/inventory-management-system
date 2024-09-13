const { GenericError, NotFoundError } = require("../errors/errorHandler");
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
    else return res.status(500).json(createBadRes(err));
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
    console.debug(data);
    if (data)
      return res
        .status(200)
        .json(createRes("Producto actualizado correctamente.", data));
    else throw new Error("Error al actualizar el producto.");
  } catch (err) {
    if (err.status) {
      return res.status(err.status).json(createBadRes(err));
    } else return res.status(500).json(createBadRes(err.message));
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
 * Busca un producto en la base de datos utilizando su código de barras.
 *
 * @async
 * @function findProductByBarcode
 * @param {Object} req - Objeto de solicitud (Request) de Express.
 * @param {Object} req.params - Objeto que contiene los parámetros de la solicitud.
 * @param {string} req.params.barcode - Código de barras del producto que se desea buscar.
 * @param {Object} res - Objeto de respuesta (Response) de Express.
 * @returns {Promise<void>} Retorna una respuesta HTTP con los datos del producto encontrado o con un mensaje de error.
 *
 * @throws {GenericError} Si ocurre un error inesperado durante la operación.
 */
const findProductByBarcode = async (req, res) => {
  try {
    const barcode = req.params.barcode;
    const data = await serv.findProductByBarcode(barcode);
    if (data instanceof NotFoundError)
      return res.status(404).json(createBadRes(data));
    else if (data instanceof GenericError)
      return res.status(500).json(createBadRes(data));
    else
      return res
        .status(200)
        .json(
          createRes(`Producto encontrado con el Código: ${barcode}.`, data)
        );
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
 * @throws {GenericError} Si ocurre un error en la capa controladora o de servicio.
 * @throws {NotFoundError} Si no se encuentra un producto con el código de barras proporcionado.
 */
const deleteProductByBarcode = async (req, res) => {
  try {
    const barcode = req.params.barcode;
    const data = await serv.deleteProductByBarcode(barcode);
    if (data instanceof NotFoundError)
      return res.status(404).json(createBadRes(data));
    else if (data instanceof GenericError)
      return res.status(500).json(createBadRes(data));
    else
      return res
        .status(200)
        .json(createRes(`Eliminado el producto con el Código: ${barcode}.`));
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
  findProductByBarcode,
  findProductsByName,
  deleteProductById,
  deleteProductByBarcode,
};
