const { NotFoundError, GenericError } = require("../errors/errorHandler");
const serv = require("../services/saleService");
const { saleDateFormatter } = require("../utils/dateUtil");
const { createBadRes, createRes } = require("../utils/responseFactory");

/**
 * Crea una venta basada en una lista de productos.
 *
 * @async
 * @function createSale
 * @param {Object} req - Objeto de solicitud (Request) de Express.
 * @param {Object} req.body - Cuerpo de la solicitud que contiene los productos.
 * @param {Object[]} req.body.products - Lista de productos a incluir en la venta.
 * @param {number} req.body.products[].id - ID del producto.
 * @param {number} req.body.products[].quantity - Cantidad del producto.
 * @param {boolean} req.body.isCash - Si la venta ocurrió en efectivo o no.
 * @param {Object} res - Objeto de respuesta (Response) de Express.
 * @returns {Promise<void>} Retorna una respuesta HTTP con el resultado de la operación.
 */
const createSale = async (req, res) => {
  try {
    const { products, isCash } = req.body;
    const data = await serv.createSale(products, isCash);
    if (data instanceof NotFoundError)
      return res.status(404).json(createBadRes(data));
    else if (data instanceof GenericError)
      return res.status(500).json(createBadRes(data));
    else {
      const sale = saleDateFormatter(data);
      return res.status(200).json(createRes("Venta creada con éxito.", sale));
    }
  } catch (err) {
    return res
      .status(500)
      .status(
        createBadRes(
          new GenericError("Error en la capa Controladora.", err.message)
        )
      );
  }
};

module.exports = {
  createSale,
};
