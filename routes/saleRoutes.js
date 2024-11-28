const express = require("express");
const {
  createSaleValidation,
  findSalesWithProductsValidation,
  idParamValidation,
} = require("../middlewares/validationMiddleware");
const {
  createSale,
  findSales,
  findSaleById,
  deleteSaleById,
} = require("../controllers/saleController");
const router = express.Router();

router.post("/create", createSaleValidation, createSale);

router.get(
  "/find/all/:withProducts",
  findSalesWithProductsValidation,
  findSales
);

router.get(
  "/find/id/:id",
  [idParamValidation, findSalesWithProductsValidation],
  findSaleById
);

router.delete("/delete/id/:id", idParamValidation, deleteSaleById);

module.exports = router;
