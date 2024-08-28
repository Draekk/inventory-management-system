const { GenericError } = require("../errors/errorHandler");
const serv = require("../services/productService");
const { createRes, createBadRes } = require("../utils/responseFactory");

/**
 * Extrae el producto del request y lo envía al servicio para crear un nuevo producto.
 * @param {Object} req Request
 * @param {Object} res Response
 * @returns {Object} Response con la data obtenida del servicio
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
 * Extrae el producto del request y lo envía al servicio para actualizar un producto.
 * @param {Object} req Request
 * @param {Object} res Response
 * @returns {Object} Response con la data obtenida del servicio
 */
const updateProduct = async (req, res) => {
  try {
    const product = req.body;
    const data = await serv.updateProduct(product);
    console.debug(data);
    if (data) {
      return res
        .status(202)
        .json(createRes("Producto actualizado correctamente.", true, data));
    }
    return res.status(404).json(createRes("Producto no encontrado."));
  } catch (err) {
    return res.status(500).json(createRes(err.message, false, null, true));
  }
};

module.exports = {
  saveProduct,
  updateProduct,
};
