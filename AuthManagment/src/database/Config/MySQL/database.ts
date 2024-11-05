import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('db', 'user', 'pass', {
  host: 'host',
  dialect: 'mysql',
  dialectOptions: {
    ssl: {
      rejectUnauthorized: false //! quitar en producción
    }
  }
});

export default sequelize;
