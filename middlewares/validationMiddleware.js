const { isEqual } = require("lodash");
const { MiddlewareError } = require("../errors/errorHandler");
const { createBadRes } = require("../utils/responseFactory");

const productValidation = (req, res, next) => {
  try {
    const productProps = [
      "id",
      "barcode",
      "name",
      "stock",
      "costPrice",
      "salePrice",
    ];
    const props = Object.keys(req.body);

    if (props[0] !== "id") {
      productProps.shift();
    }
    if (isEqual(props, productProps)) {
      next();
    }
    throw new Error("Los parámetros del objeto son incorrectos.");
  } catch (err) {
    return res
      .status(500)
      .json(createBadRes(new MiddlewareError(err.message, err)));
  }
};

module.exports = {
  productValidation,
};
