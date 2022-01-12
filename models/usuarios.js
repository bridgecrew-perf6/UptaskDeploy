const Sequelize = require('sequelize');
const db = require('../config/db');
const Proyectos = require('../models/proyecto');
const bcrypt = require('bcrypt-nodejs');

const Usuarios = db.define('usuario', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: Sequelize.STRING(60),
        allowNull: false,
        validate: {
            isEmail: {
                msg: 'Agrega un correo valido'
            },
            notEmpty: {
                msg: 'El correo no puede estar vació'
            }
        },
        unique: {
            args: true,
            msg: 'Usuario ya registrado'
        }
    },
    password: {
        type: Sequelize.STRING(60),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'El password no puede estar vacio'
            }
        }
    },
    activo: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    token: Sequelize.STRING,
    expiracion: Sequelize.DATE
},
    {
        hooks: {
            beforeCreate(usuario) {
                usuario.password = bcrypt.hashSync(usuario.password, bcrypt.genSaltSync(10));
            }
        }
    });

//metodos personalizados

Usuarios.prototype.verificarPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
}

Usuarios.hasMany(Proyectos)

module.exports = Usuarios;