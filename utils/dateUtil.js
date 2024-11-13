// /**
//  * Formatea una fecha en un formato de cadena legible según el estándar británico (dd/mm/yyyy hh:mm:ss).
//  *
//  * @function dateFormatter
//  * @param {Date} date - El objeto de fecha a formatear.
//  * @returns {string} La fecha formateada en formato "dd/mm/yyyy hh:mm:ss" (24 horas).
//  */
// const dateFormatter = (date) => {
//   return date.toLocaleString("en-GB", {
//     year: "numeric",
//     month: "2-digit",
//     day: "2-digit",
//     hour: "2-digit",
//     minute: "2-digit",
//     second: "2-digit",
//     hour12: false,
//   });
// };

/**
 * Formatea una fecha en un formato ISO estándar (YYYY-MM-DDTHH:mm:ss).
 *
 * @function dateFormatter
 * @param {Date} date - El objeto de fecha a formatear.
 * @returns {string} La fecha formateada en formato "YYYY-MM-DDTHH:mm:ss".
 */
const dateFormatter = (date) => {
  return date.toISOString().replace("Z", ""); // Remueve el "Z" si no necesitas UTC
};

/**
 * Formatea un objeto de venta para incluir la fecha formateada y devuelve un nuevo objeto de venta.
 *
 * @function saleDateFormatter
 * @param {Object} sale - El objeto de venta a formatear.
 * @param {number} sale.id - El ID de la venta.
 * @param {number} sale.quantity - La cantidad de productos vendidos.
 * @param {number} sale.total - El total de la venta.
 * @param {boolean} sale.isCash - Indica si la venta fue en efectivo.
 * @param {Date} sale.createdAt - La fecha y hora en que se creó la venta.
 * @returns {Object} Un nuevo objeto de venta con la fecha formateada.
 */
const saleDateFormatter = (sale) => {
  sale.dataValues.createdAt = dateFormatter(sale.createdAt);
  return sale;
};

module.exports = {
  dateFormatter,
  saleDateFormatter,
};
