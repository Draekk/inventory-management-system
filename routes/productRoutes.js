const express = require("express");
const router = express.Router();
const {
  productValidation,
  idParamValidation,
  barcodeParamValidation,
} = require("../middlewares/validationMiddleware");
const controller = require("../controllers/productController");

router.get("/find/all", controller.findProducts);

router.get("/find/id/:id", idParamValidation, controller.findProductById);

router.get(
  "/find/barcode/:barcode",
  barcodeParamValidation,
  controller.findProductByBarcode
);

router.get("/find/name/:name", controller.findProductsByName);

router.delete(
  "/delete/id/:id",
  idParamValidation,
  controller.deleteProductById
);

router.delete(
  "/delete/barcode/:barcode",
  barcodeParamValidation,
  controller.deleteProductByBarcode
);

router.post("/create", productValidation, controller.saveProduct);

router.put("/update", productValidation, controller.updateProduct);

module.exports = router;
