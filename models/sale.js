const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/dbConfig");

class Sale extends Model {}
Sale.init(
  {
    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      allowNull: false,
    },
    total: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    isCash: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "sales",
    updatedAt: false,
  }
);

module.exports = { Sale };
