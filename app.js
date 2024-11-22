require("dotenv");
const express = require("express");
const cors = require("cors");
const { env } = require("process");

const productRouter = require("./routes/productRoutes");
const saleRouter = require("./routes/saleRoutes");

const corsOptions = {
  origin: function (origin, callback) {
    if (origin === "http://localhost:5173") {
      console.log(origin);
      callback(null, true);
    } else {
      callback(new Error("Conexión denegada..."));
    }
  },
};

const app = express();
app.use(cors());
const PORT = env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api/product", productRouter);
app.use("/api/sale", saleRouter);

app.listen(PORT, () =>
  console.log(`Servidor ejecutandose en el puerto: ${PORT}...`)
);
