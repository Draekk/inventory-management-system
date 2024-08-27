const serv = require("../services/productService");
const { createResponse } = require("../utils/responseFactory");

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

module.exports = {
  savedProduct,
};
