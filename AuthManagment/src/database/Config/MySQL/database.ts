import { Dialect, Sequelize } from 'sequelize';

const dialectOptions = process.env.NODE_ENV === 'development'
  ? {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    }
  : undefined;

const sequelize = new Sequelize(
  process.env.DB_NAME as string,
  process.env.DB_USER as string,
  process.env.DB_PASSWORD as string,
  {
    host: process.env.DB_HOST as string,
    dialect: 'mysql',
    port: parseInt(process.env.DB_PORT as string),
    dialectOptions,
    logging: console.log,
    pool: {
      max: 5,
      min: 0,
      acquire: 60000, 
      idle: 10000    
  }
  }
);

export default sequelize;
