const Sequelize = require('sequelize');
require('dotenv').config({ path: 'variables.env' })

const sequelize = new Sequelize(
    process.env.DB_NOMBRE,
    process.env.DB_USER,
    process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: 'mysql',//postgres
    port: process.env.DB_PORT,
    define: {
        timestamps: false
    },

    pool: {
        max: 5,
        min: 0,
        acquire: 300,
        idle: 10000
    }
});

module.exports = sequelize;