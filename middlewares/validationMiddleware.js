const { isEqual } = require("lodash");
const { MiddlewareError } = require("../errors/errorHandler");
const { createBadRes } = require("../utils/responseFactory");

/**
 * Middleware que valida las propiedades del objeto de producto en el cuerpo de la solicitud.
 * Se asegura de que el objeto tenga las propiedades correctas para crear o actualizar un producto.
 *
 * @function productValidation
 * @param {Object} req - Objeto de solicitud (Request) de Express.
 * @param {Object} req.body - Cuerpo de la solicitud que contiene las propiedades del producto.
 * @param {number} [req.body.id] - ID del producto (opcional si es una creación).
 * @param {string} req.body.barcode - Código de barras del producto.
 * @param {string} req.body.name - Nombre del producto.
 * @param {number} req.body.stock - Stock disponible del producto.
 * @param {number} req.body.costPrice - Precio de costo del producto.
 * @param {number} req.body.salePrice - Precio de venta del producto.
 * @param {Object} res - Objeto de respuesta (Response) de Express.
 * @param {Function} next - Función para pasar al siguiente middleware.
 * @returns {void}
 *
 * @throws {MiddlewareError} Si las propiedades del producto son incorrectas.
 */
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
      .json(
        createBadRes(new MiddlewareError("Error en el Request.", err.message))
      );
  }
};

/**
 * Middleware que valida si el parámetro `id` en la URL es un número válido.
 *
 * @function idParamValidation
 * @param {Object} req - Objeto de solicitud (Request) de Express.
 * @param {Object} req.params - Contiene los parámetros de la URL.
 * @param {string} req.params.id - ID del producto en la URL.
 * @param {Object} res - Objeto de respuesta (Response) de Express.
 * @param {Function} next - Función para pasar al siguiente middleware.
 * @returns {void}
 *
 * @throws {MiddlewareError} Si el parámetro `id` no es un número válido.
 */
const idParamValidation = (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (!isNaN(id)) {
      return next();
    } else throw new Error("El ID de la URL no es un número válido.");
  } catch (err) {
    return res
      .status(400)
      .json(
        createBadRes(new MiddlewareError("Error en el Request.", err.message))
      );
  }
};

/**
 * Middleware que valida si el parámetro `barcode` en la URL es válido.
 *
 * @function barcodeParamValidation
 * @param {Object} req - Objeto de solicitud (Request) de Express.
 * @param {Object} req.params - Contiene los parámetros de la URL.
 * @param {string} req.params.barcode - Código de barras del producto en la URL.
 * @param {Object} res - Objeto de respuesta (Response) de Express.
 * @param {Function} next - Función para pasar al siguiente middleware.
 * @returns {void}
 *
 * @throws {MiddlewareError} Si el parámetro `barcode` no es válido.
 */
const barcodeParamValidation = (req, res, next) => {
  try {
    const barcode = req.params.barcode;
    if (barcode) {
      return next();
    } else throw new Error("El Código en la URL no es válido.");
  } catch (err) {
    return res
      .status(400)
      .json(
        createBadRes(new MiddlewareError("Error en el Request.", err.message))
      );
  }
};

/**
 * Middleware que valida la estructura de la solicitud para crear una venta.
 * Se asegura de que el cuerpo de la solicitud contenga una lista de productos y una propiedad `isCash`.
 *
 * @function createSaleValidation
 * @param {Object} req - Objeto de solicitud (Request) de Express.
 * @param {Object} req.body - Cuerpo de la solicitud.
 * @param {Object[]} req.body.products - Lista de productos incluidos en la venta.
 * @param {number} req.body.products[].id - ID del producto (numérico).
 * @param {number} req.body.products[].quantity - Cantidad del producto (numérico).
 * @param {boolean} req.body.isCash - Indica si la venta es en efectivo.
 * @param {Object} res - Objeto de respuesta (Response) de Express.
 * @param {Function} next - Función para pasar al siguiente middleware.
 * @returns {void}
 *
 * @throws {MiddlewareError} Si el cuerpo de la solicitud no tiene la estructura correcta.
 */
const createSaleValidation = (req, res, next) => {
  try {
    const props = Object.keys(req.body);
    if (props[0] === "products" && props[1] === "isCash") {
      const { products } = req.body;
      products.forEach((p) => {
        const pProps = Object.keys(p);
        if (pProps[0] !== "id" || pProps[1] !== "quantity") {
          throw new Error(
            "Error en propiedad del producto, debe contener una propiedad 'id' numérico y una propiedad 'quantity' numérico."
          );
        }
      });
      return next();
    } else
      throw new Error(
        "Error en propiedad de venta, debe contener una propiedad 'products' lista de objetos y una propiedad 'isCash' booleana."
      );
  } catch (err) {
    return res
      .status(400)
      .json(
        createBadRes(new MiddlewareError("Error en el Request.", err.message))
      );
  }
};

module.exports = {
  productValidation,
  idParamValidation,
  barcodeParamValidation,
  createSaleValidation,
};
