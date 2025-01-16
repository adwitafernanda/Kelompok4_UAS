const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'mysql'
});

const Lapangan = sequelize.define('Lapangan', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nama: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lokasi: {
        type: DataTypes.STRING,
        allowNull: false
    },
    harga_per_jam: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    tipe: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        field: 'created_at'
    },
    updatedAt: {
        type: DataTypes.DATE,
        field: 'updated_at'
    }
}, {
    tableName: 'lapangan' // Tentukan nama tabel
});

module.exports = Lapangan;
