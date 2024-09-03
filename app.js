require("dotenv");
const express = require("express");
const { env } = require("process");

const productRouter = require("./routes/productRoutes");

const app = express();
const PORT = env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api/product", productRouter);

app.listen(PORT, () =>
  console.log(`Servidor ejecutandose en el puerto: ${PORT}...`)
);

app.get("/", (req, res) => {
  res.send("Hello World");
});
