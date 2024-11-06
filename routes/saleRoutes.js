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

module.exports = router;
