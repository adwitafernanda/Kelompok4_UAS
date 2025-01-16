const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('futsal_booking', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  dialectOptions: {
    charset: 'utf8mb4' // Ubah encoding ke utf8mb4
  }
});

sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = sequelize;
