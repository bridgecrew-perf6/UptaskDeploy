const passport = require('passport');
const Usuarios = require('../models/usuarios');
const Sequelize = require('sequelize')
const Op = Sequelize.Op;
const crypto = require('crypto');
const Bcrypt = require('bcrypt-nodejs');
const enviarEmail = require('../handlers/email')

exports.autenticarUsuario = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Ambos campos son obligatorios'
});

//funcion poara verificar si esta logueado o no

exports.usuarioAutenticado = (req, res, next) => {
    //si el usuario esta autenticado, adelante

    if (req.isAuthenticated()) {
        return next();
    }
    //si no esta autenticado, redirigir al formulario
    return res.redirect('/iniciar-sesion');
}

//cerrar sesion

exports.cerrarSesion = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/iniciar-sesion')
    });
}

// Genera un token , si el usuario es valido
exports.enviarToken = async (req, res) => {
    // Verificar que el usuario existe
    const { email } = req.body
    const usuario = await Usuarios.findOne({ where: { email } });

    // Si no existe el usuario
    if (!usuario) {
        req.flash('error', 'No existe esa cuenta');
        res.redirect('/reestablecer');
    }
    //Usuario Existe
    usuario.token = crypto.randomBytes(20).toString('hex');
    usuario.expiracion = Date.now() + 3600000;

    // Guardar los nuevos datos
    await usuario.save();

    // url de reset
    const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`;


    //enviar el correo con el token
    await enviarEmail.enviar({
        usuario,
        subject: 'Restablecer contraseña',
        resetUrl,
        archivo: 'reestablecerPassword'
    })

    //redirigir a la pagina principal de la
    req.flash('correcto', 'Se enviaron las instrucciones a tu correo')
    res.redirect('/iniciar-sesion')
}

exports.validarToken = async (req, res) => {

    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token
        }
    });

    if (!usuario) {
        req.flash('error', 'No Válido')
        res.redirect('/reestablecer');
    }

    //formulario para usuario valido

    res.render('resetPassword', {
        nombrePagina: 'Reestablecer password'
    })


}

exports.actualizarPassword = async (req, res) => {
    //verifica el token valido y fecha de expiracion
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token,
            expiracion: {
                [Op.gte]: Date.now()
            }
        }
    })

    //verificatr si el usuario existe en
    if (!usuario) {
        req.flash('error', 'No Válido');
        res.redirect('/reestablecer');
    }

    //hashear password

    usuario.password = Bcrypt.hashSync(req.body.password, Bcrypt.genSaltSync(10));
    usuario.token = null;
    usuario.expiracion = null;

    //guardamos nuevo passweord

    await usuario.save();

    req.flash('correcto', 'Tu password se ha modificado correctamente');
    res.redirect('/iniciar-sesion')
}