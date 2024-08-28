require("dotenv");
const express = require("express");
const { env } = require("process");

const sequelize = require("./config/dbConfig");
const { Product, Sale } = require("./models");
const controller = require("./controllers/productController");

const app = express();
const PORT = env.PORT || 3000;

app.use(express.json());

app.listen(PORT, () =>
  console.log(`Servidor ejecutandose en el puerto: ${PORT}...`)
);

app.get("/", async (req, res) => {
  const product = {
    id: 36,
    barcode: "1447",
    name: "foobar34",
    stock: 20,
    costPrice: 3453,
    salePrice: 7580,
  };
  req.body = product;
  await controller.updateProduct(req, res);
});
