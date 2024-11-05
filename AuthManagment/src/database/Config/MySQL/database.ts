import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('ms-auth', 'auth', '0612583492761', {
  host: '34.28.117.237',
  dialect: 'mysql',
  dialectOptions: {
    ssl: {
      rejectUnauthorized: false
    }
  }
});

export default sequelize;
