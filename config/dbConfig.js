require("dotenv").config();
const { env } = require("process");
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(env.DB_NAME, env.DB_USER, env.DB_PASS, {
  host: env.DB_HOST,
  dialect: env.DB_DIALECT,
});

sequelize
  .authenticate()
  .then(() => console.log("Conexión establecida correctamente"))
  .catch((err) =>
    console.error("Error en conexión con la base de datos:", err)
  );

module.exports = sequelize;
