import { Dialect, Sequelize } from 'sequelize';
const sequelize = new Sequelize(
  process.env.DB_NAME as string,
  process.env.DB_USER as string,
  process.env.DB_PASSWORD as string,
  {
    host: process.env.DB_HOST as string,
    dialect: process.env.DB_DIALECT as Dialect,
    port: parseInt(process.env.DB_PORT as string),
    logging: console.log,
  }
);
export default sequelize;
