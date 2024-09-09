const express = require("express");
const { createSaleValidation } = require("../middlewares/validationMiddleware");
const { createSale } = require("../controllers/saleController");
const router = express.Router();

router.post("/create", createSaleValidation, createSale);

module.exports = router;
