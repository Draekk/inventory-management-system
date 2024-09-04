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

const idParamValidation = (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (!isNaN(id)) {
      console.log("im here");
      next();
    } else throw new Error("El ID de la URL no es un número válido.");
  } catch (err) {
    return res
      .status(400)
      .json(createBadRes(new MiddlewareError(err.message, err)));
  }
};

const barcodeParamValidation = (req, res, next) => {
  try {
    const barcode = req.params.barcode;
    if (barcode) {
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
  barcodeParamValidation,
};
