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
    console.log(props);

    if (props[0] !== "id") {
      productProps.shift();
      console.log(productProps);
      console.log(isEqual(productProps, props));
    }
    if (isEqual(props, productProps)) {
      return next();
    }
    throw new Error("Los parámetros del objeto son incorrectos.");
  } catch (err) {
    return res
      .status(500)
      .json(createBadRes(new MiddlewareError(err.message, err)));
  }
};

const idParamValidation = (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (!isNaN(id)) {
      return next();
    } else throw new Error("El ID de la URL no es un número válido.");
  } catch (err) {
    return res
      .status(400)
      .json(createBadRes(new MiddlewareError(err.message, err)));
  }
};

module.exports = {
  productValidation,
  idParamValidation,
};
