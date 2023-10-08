import { Sequelize } from "sequelize";

export const sequelize = new Sequelize("vnfixer", "root", "", {
  host: "localhost",
  dialect: "mysql",
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
