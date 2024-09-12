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

/**
 * Controlador que busca todas las ventas, opcionalmente incluyendo productos asociados, y devuelve las ventas formateadas.
 *
 * @async
 * @function findSales
 * @param {Object} req - El objeto de solicitud HTTP.
 * @param {Object} req.body - El cuerpo de la solicitud.
 * @param {boolean} req.body.withProducts - Indica si se deben incluir los productos asociados a las ventas.
 * @param {Object} res - El objeto de respuesta HTTP.
 * @returns {Promise<Object>} Responde con un JSON que contiene un mensaje y una lista de ventas, o un error en caso de fallo.
 *
 * @throws {GenericError} Si ocurre un error en la capa controladora al buscar las ventas.
 */
const findSales = async (req, res) => {
  try {
    const { withProducts } = req.body;
    const data = await serv.findSales(withProducts);

    if (Array.isArray(data)) {
      const sales = data.map((sale) => saleDateFormatter(sale));
      return res.status(200).json(createRes("Ventas encontradas.", sales));
    } else {
      throw new Error("Error al buscar las ventas.");
    }
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
 * Controlador para buscar una venta por su ID, opcionalmente incluyendo los productos asociados.
 *
 * @async
 * @function findSaleById
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} req.params - Parámetros de la solicitud.
 * @param {number} req.params.id - El ID de la venta a buscar.
 * @param {Object} req.body - Cuerpo de la solicitud.
 * @param {boolean} req.body.withProducts - Indica si se deben incluir los productos asociados.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Promise<void>} Responde con los detalles de la venta encontrada o un error.
 *
 * @throws {Error} Devuelve un error si ocurre algún problema en la búsqueda de la venta.
 */
const findSaleById = async (req, res) => {
  try {
    const { id } = req.params;
    const { withProducts } = req.body;

    const data = await serv.findSaleById(id, withProducts);
    return res
      .status(200)
      .json(
        createRes(`Venta encontrada con el ID: ${id}.`, saleDateFormatter(data))
      );
  } catch (err) {
    return res.status(500).json(createBadRes(err.message, err));
  }
};

module.exports = {
  createSale,
  findSales,
  findSaleById,
};
