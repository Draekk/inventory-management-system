const { Product } = require("./product");
const { Sale } = require("./sale");
const sequelize = require("../config/dbConfig");

//Relaciones de los modelos
Product.belongsToMany(Sale, {
  through: "products_sales",
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
  timestamps: false,
  uniqueKey: false,
});

Sale.belongsToMany(Product, {
  through: "products_sales",
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
  timestamps: false,
  uniqueKey: false,
});

//Sincronización las tablas
sequelize
  .sync()
  .then(() => console.log("Tablas sincronizadas exitósamente."))
  .catch((err) => console.error("Error sincronizando las tablas...", err));

const ProductSale = sequelize.models.products_sales;

module.exports = { Product, Sale, ProductSale };
