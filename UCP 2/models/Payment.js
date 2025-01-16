const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'mysql'
});

const Payment = sequelize.define('Payment', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    amount: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    paymentMethod: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'payments' // Tentukan nama tabel
});

module.exports = Payment;
