const express = require("express");
const router = express.Router();
const {
  productValidation,
  idParamValidation,
} = require("../middlewares/validationMiddleware");
const controller = require("../controllers/productController");

router.get("/find/all", controller.findProducts);

router.get("/find/id/:id", idParamValidation, controller.findProductById);

//TODO: find products by barcode

router.get("/find/name/:name", controller.findProductsByName);

router.delete(
  "/delete/id/:id",
  idParamValidation,
  controller.deleteProductById
);

//TODO: delete products by barcode

router.post("/create", productValidation, controller.saveProduct);

router.put("/update", productValidation, controller.updateProduct);

module.exports = router;
