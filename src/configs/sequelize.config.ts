import { Sequelize } from "sequelize";

export const sequelize = new Sequelize("vnfixer", "root", "", {
  host: "localhost",
  dialect: "mysql",
  logging: false,
});
sequelize.sync({ alter: true });

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection successfully.");
  })
  .catch((error) => {
    console.error("Unable to connect to the database: ", error);
  });
