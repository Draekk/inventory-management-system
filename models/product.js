const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/dbConfig");

class Product extends Model {}
Product.init(
  {
    barcode: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    stock: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    costPrice: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    salePrice: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: "products",
    timestamps: false,
  }
);

module.exports = { Product };
