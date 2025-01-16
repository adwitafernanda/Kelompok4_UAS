const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'mysql'
});

const Booking = sequelize.define('Booking', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    time: {
        type: DataTypes.TIME,
        allowNull: false
    },
    duration: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    status: {
        type: DataTypes.ENUM('Belum Lunas', 'Lunas'),
        allowNull: false,
        defaultValue: 'Belum Lunas' // Default status
    },
    totalharga: {
        type: DataTypes.INTEGER,  // Ubah ke INTEGER
        allowNull: false,
    },
    paymentMethod: {
        type: DataTypes.ENUM('banktransfer', 'cash'), // Metode pembayaran
        allowNull: false,
        defaultValue: 'cash'
    }
    
}, {
    tableName: 'bookings',
    timestamps: false
});

module.exports = Booking;
