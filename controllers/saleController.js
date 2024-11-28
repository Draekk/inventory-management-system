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
    return res
      .status(201)
      .json(
        createRes("Se ha creado la venta con éxito.", saleDateFormatter(data))
      );
  } catch (err) {
    if (err.status) return res.status(err.status).json(createBadRes(err));
    else return res.status(500).json(createBadRes(err.message));
  }
};

/**
 * Obtiene una lista de ventas desde el servicio y responde con la lista formateada.
 *
 * @async
 * @function findSales
 * @param {Object} req - El objeto de la solicitud HTTP.
 * @param {Object} res - El objeto de la respuesta HTTP.
 * @returns {Promise<void>} - Una promesa que se resuelve cuando se envía la respuesta al cliente.
 * @throws {Error} - Lanza un error si ocurre un problema al obtener las ventas o al formatear la respuesta.
 */
const findSales = async (req, res) => {
  try {
    const { withProducts } = req.params;
    const data = await serv.findSales(+withProducts);
    const sales = data.map((sale) => saleDateFormatter(sale));
    return res.status(200).json(createRes("Ventas encontradas.", sales));
  } catch (err) {
    if (err.status) return res.status(err.status).json(createBadRes(err));
    else return res.status(500).json(createBadRes(err.message));
  }
};

/**
 * Controlador para encontrar una venta por su ID y responder con los datos de la venta.
 *
 * @async
 * @function findSaleById
 * @param {Object} req - El objeto de solicitud de Express.
 * @param {Object} res - El objeto de respuesta de Express.
 * @returns {Promise<void>} - No devuelve un valor, pero envía una respuesta HTTP.
 * @throws {Error} - Lanza un error si ocurre un problema al encontrar la venta o al procesar la respuesta.
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
    if (err.status) return res.status(err.status).json(createBadRes(err));
    else return res.status(500).json(createBadRes(err.message));
  }
};

/**
 * Controlador para eliminar una venta por su ID.
 *
 * @async
 * @function deleteSaleById
 * @param {Object} req - El objeto de solicitud de Express.
 * @param {Object} res - El objeto de respuesta de Express.
 * @returns {Promise<void>} - No devuelve un valor, pero envía una respuesta HTTP.
 * @throws {Error} - Lanza un error si ocurre un problema al eliminar la venta o al procesar la respuesta.
 */
const deleteSaleById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await serv.deleteSaleById(id);
    return res
      .status(200)
      .json(createRes(`Venta con ID ${id} eliminada.`, data));
  } catch (err) {
    if (err.status) return res.status(err.status).json(createBadRes(err));
    else return res.status(500).json(createBadRes(err.message));
  }
};

module.exports = {
  createSale,
  findSales,
  findSaleById,
  deleteSaleById,
};
