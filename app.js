require("dotenv");
const express = require("express");
const { env } = require("process");

const sequelize = require("./config/dbConfig");
const { Product, Sale } = require("./models");

const app = express();
const PORT = env.PORT || 3000;

app.listen(PORT, () =>
  console.log(`Servidor ejecutandose en el puerto: ${PORT}...`)
);

app.get("/", async (req, res) => {
  return res.send("Hello world");
});
