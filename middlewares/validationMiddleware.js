const { isEqual, isBoolean, isNumber } = require("lodash");
const { createBadRes } = require("../utils/responseFactory");
const { ValidationError } = require("../errors/errorhandler");

/**
 * Middleware para validar las propiedades de un producto en el cuerpo de la solicitud.
 *
 * @function productValidation
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} req.body - Cuerpo de la solicitud que contiene los datos del producto.
 * @param {number} [req.body.id] - ID del producto (opcional, numérico).
 * @param {string} req.body.barcode - Código de barras del producto (string).
 * @param {string} req.body.name - Nombre del producto (string).
 * @param {number} req.body.stock - Stock disponible del producto (numérico).
 * @param {number} req.body.costPrice - Precio de costo del producto (numérico).
 * @param {number} req.body.salePrice - Precio de venta del producto (numérico).
 * @param {Object} res - Objeto de respuesta de Express.
 * @param {Function} next - Función para pasar al siguiente middleware si la validación es exitosa.
 * @throws {ValidationError} Lanza un error si las propiedades del objeto son incorrectas.
 *
 * @returns {void} Si la validación es correcta, llama a `next()`, en caso contrario devuelve una respuesta con error.
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
    const { barcode, name } = req.body;

    if (props[0] !== "id") {
      productProps.shift();
    }
    if (isEqual(props, productProps) && barcode !== "" && name !== "") {
      return next();
    } else if (barcode === "" || name === "") {
      throw new ValidationError(
        "Las propiedades 'barcode' y 'name' no pueden estar vacías."
      );
    } else {
      throw new ValidationError(
        "Las propiedades del objeto son incorrectos. La estructura debe ser: 'id' (opcional | numérico), 'barcode' (string), 'name' (string), 'stock' (numérico), 'costPrice' (numérico), 'salePrice' (numérico)."
      );
    }
  } catch (err) {
    if (err.status) return res.status(err.status).json(createBadRes(err));
    else return res.status(500).json(createBadRes(err));
  }
};

/**
 * Middleware para validar que el parámetro `id` de la URL sea un número válido.
 *
 * @function idParamValidation
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} req.params - Parámetros de la URL.
 * @param {string} req.params.id - ID recibido en la URL, que debe ser un número.
 * @param {Object} res - Objeto de respuesta de Express.
 * @param {Function} next - Función que llama al siguiente middleware si la validación es exitosa.
 * @throws {ValidationError} Lanza un error si el `id` no es un número válido.
 *
 * @returns {void} Si la validación es correcta, llama a `next()`. En caso contrario, devuelve una respuesta con el error.
 */
const idParamValidation = (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (!isNaN(id)) {
      return next();
    } else throw new ValidationError("El ID de la URL no es un número válido.");
  } catch (err) {
    if (err.status) return res.status(err.status).json(createBadRes(err));
    else return res.status(500).json(createBadRes(err));
  }
};

/**
 * Middleware para validar que el parámetro `barcode` de la URL sea válido.
 *
 * @function barcodeParamValidation
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} req.params - Parámetros de la URL.
 * @param {string} req.params.barcode - Código de barras recibido en la URL, que debe ser un string válido.
 * @param {Object} res - Objeto de respuesta de Express.
 * @param {Function} next - Función que llama al siguiente middleware si la validación es exitosa.
 * @throws {ValidationError} Lanza un error si el `barcode` no es válido.
 *
 * @returns {void} Si la validación es correcta, llama a `next()`. En caso contrario, devuelve una respuesta con el error.
 */
const barcodeParamValidation = (req, res, next) => {
  try {
    const barcode = req.params.barcode;
    if (barcode) {
      return next();
    } else
      throw new ValidationError("El Código de barra en la URL no es válido.");
  } catch (err) {
    if (err.status) return res.status(err.status).json(createBadRes(err));
    else return res.status(500).json(createBadRes(err));
  }
};

/**
 * Middleware para validar el cuerpo de la solicitud al crear una venta.
 *
 * @function createSaleValidation
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} req.body - Cuerpo de la solicitud.
 * @param {Array<Object>} req.body.products - Lista de productos en la venta.
 * @param {number} req.body.products[].id - ID del producto, debe ser un número.
 * @param {number} req.body.products[].quantity - Cantidad del producto, debe ser un número.
 * @param {boolean} req.body.isCash - Indica si la venta es en efectivo.
 * @param {Object} res - Objeto de respuesta de Express.
 * @param {Function} next - Función que llama al siguiente middleware si la validación es exitosa.
 * @throws {ValidationError} Lanza un error si las propiedades de la venta o de los productos no son válidas.
 *
 * @returns {void} Si la validación es correcta, llama a `next()`. En caso contrario, devuelve una respuesta con el error.
 */
const createSaleValidation = (req, res, next) => {
  try {
    const props = Object.keys(req.body);
    if (props[0] === "products" && props[1] === "isCash") {
      const { products } = req.body;
      if (products.length === 0)
        throw new ValidationError("La lista de ventas no puede estar vacía.");
      products.forEach((p) => {
        const pProps = Object.keys(p);
        if (pProps[0] !== "id" || pProps[1] !== "quantity") {
          throw new ValidationError(
            "Error en propiedad del producto, debe contener una propiedad 'id' (numérico) y una propiedad 'quantity' (numérico)."
          );
        }
      });
      return next();
    } else
      throw new ValidationError(
        "Error en propiedad de venta, debe contener una propiedad 'products' (lista de objetos) y una propiedad 'isCash' (booleana)."
      );
  } catch (err) {
    if (err.status) return res.status(err.status).json(createBadRes(err));
    else return res.status(500).json(createBadRes(err));
  }
};

/**
 * Middleware para validar la propiedad 'withProducts' en el cuerpo de la solicitud.
 *
 * @function findSalesWithProductsValidation
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} req.body - Cuerpo de la solicitud.
 * @param {boolean} req.body.withProducts - Indica si se deben incluir los productos en la respuesta, debe ser un booleano.
 * @param {Object} res - Objeto de respuesta de Express.
 * @param {Function} next - Función que llama al siguiente middleware si la validación es exitosa.
 * @throws {ValidationError} Lanza un error si 'withProducts' no es de tipo booleano.
 *
 * @returns {void} Si la validación es correcta, llama a `next()`. En caso contrario, devuelve una respuesta con el error.
 */
const findSalesWithProductsValidation = (req, res, next) => {
  try {
    const { withProducts } = req.params;

    if (withProducts === "1" || withProducts === "0") return next();
    else
      throw new ValidationError("El parametro debe ser un numero entre 0 y 1");
  } catch (err) {
    if (err.status) return res.status(err.status).json(createBadRes(err));
    else return res.status(500).json(createBadRes(err));
  }
};

module.exports = {
  productValidation,
  idParamValidation,
  barcodeParamValidation,
  createSaleValidation,
  findSalesWithProductsValidation,
};
