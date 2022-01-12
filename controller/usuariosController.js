const Usuarios = require('../models/usuarios')
const enviarEmail = require('../handlers/email')
exports.formCrearCuenta = (req, res) => {
    res.render('crearCuenta', {
        nombrePagina: 'Crear Cuenta en Uptask'
    })
}

exports.forminiciarSesion = (req, res) => {
    const { error } = res.locals.mensajes;
    res.render('iniciarSesion', {
        nombrePagina: 'Iniciar Sesión en Uptask',
        error
    })
}

exports.crearCuenta = async (req, res) => {
    //leeer datos
    const { email, password } = req.body
    try {
        //crear usuarios
        await Usuarios.create({ email, password });
        //crear url de confirmacion

        const confirmarUrl = `http://${req.headers.host}/confirmar/${email}`;
        //crear el objeto de usuario
        const usuario = {
            email
        }

        //enviar email
        await enviarEmail.enviar({
            usuario,
            subject: 'Confirma tu Cuenta en Uptask',
            confirmarUrl,
            archivo: 'confirmar-cuenta'
        })

        //redirigir al usuarios
        req.flash('correcto', 'Confirma tu cuenta en el correo que te enviamos');
        res.redirect('/iniciar-sesion');
    } catch (error) {
        req.flash('error', error.errors.map(error => error.message));
        res.render('crearCuenta', {
            mensajes: req.flash(),
            nombrePagina: 'Crear cuenta en Uptask',
            email, password
        })
    }
}

exports.formRestablecerPassword = (req, res) => {
    res.render('reestablecer', {
        nombrePagina: 'Reestablecer tu Contraseña'
    })
}
//Cambia el estado de la cuenta
exports.confirmarCorreo = async (req, res) => {
    const usuario = await Usuarios.findOne({
        where: {
            email: req.params.correo
        }
    });

    //si no exites el usuario que
    if (!usuario) {
        req.flash('error', 'No válido')
        res.redirect('/crear-cuenta');
    }

    usuario.activo = 1;
    await usuario.save();

    req.flash('correcto', 'Cuenta activada con éxito');
    res.redirect('/iniciar-sesion');

}