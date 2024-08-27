const serv = require("../services/productService");
const { createResponse } = require("../utils/responseFactory");

/**
 * Extrae el producto del request y lo envía al servicio para crear un nuevo producto.
 * @param {Object} req Request
 * @param {Object} res Response
 * @returns {Object} Response con la data obtenida del servicio
 */
const savedProduct = async (req, res) => {
  try {
    const product = req.body;
    const data = await serv.saveProduct(product);
    if (data) {
      return res
        .status(202)
        .json(createResponse("Producto creado exitósamente", true, data));
    }
    return res
      .status(404)
      .json(createResponse("Producto no ha sido creado.", false));
  } catch (err) {
    return res.status(500).json(createResponse(err.message, false, null, true));
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
        .json(
          createResponse("Producto actualizado correctamente.", true, data)
        );
    }
    return res.status(404).json(createResponse("Producto no encontrado."));
  } catch (err) {
    return res.status(500).json(createResponse(err.message, false, null, true));
  }
};

module.exports = {
  savedProduct,
  updateProduct,
};
