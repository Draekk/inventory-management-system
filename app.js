require("dotenv");
const express = require("express");
const { env } = require("process");

const sequelize = require("./config/dbConfig");
const { Product, Sale } = require("./models");

const app = express();
const PORT = env.PORT || 3000;

app.use(express.json());

app.listen(PORT, () =>
  console.log(`Servidor ejecutandose en el puerto: ${PORT}...`)
);

app.get("/", (req, res) => {
  res.send("Hello World");
});
