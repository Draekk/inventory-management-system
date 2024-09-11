const express = require("express");
const {
  createSaleValidation,
  findSalesWithProductsValidation,
} = require("../middlewares/validationMiddleware");
const { createSale, findSales } = require("../controllers/saleController");
const router = express.Router();

router.post("/create", createSaleValidation, createSale);

router.get("/find/all", findSalesWithProductsValidation, findSales);

module.exports = router;
