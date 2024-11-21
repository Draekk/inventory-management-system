require("dotenv").config();
const { env } = require("process");
const { Sequelize } = require("sequelize");

// const sequelize = new Sequelize(env.DB_NAME, env.DB_USER, env.DB_PASS, {
//   host: env.DB_HOST,
//   dialect: env.DB_DIALECT,
//   timezone: "-04:00",
// });

// sequelize
//   .authenticate()
//   .then(() => console.log("Conexión establecida correctamente"))
//   .catch((err) =>
//     console.error("Error en conexión con la base de datos:", err)
//   );

// module.exports = sequelize;

async function dbConnection() {
  try {
    const sequelize = new Sequelize(env.DB_NAME, env.DB_USER, env.DB_PASS, {
      host: env.DB_HOST,
      dialect: env.DB_DIALECT,
      timezone: "-04:00",
    });

    await sequelize.authenticate();
    console.log("Conexion a base de datos exitosa!");

    return sequelize;
  } catch (err) {
    console.error("Error al conectar con base de datos...", err);
  }
}

module.exports = dbConnection;
