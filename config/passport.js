const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

//We will need the models folder to check passport agains
const Usuarios = require('../models/usuarios');

// Local Strategy - login con credenciales propias
// Local Strategy - login con credenciales propias
passport.use(
    new LocalStrategy(
        // por default passport espera un usuario y password
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async (email, password, done) => {
            try {
                const usuario = await Usuarios.findOne({
                    where: {
                        email,
                        activo: 1
                    }
                });

                // El usuario existe, password incorrecto
                if (!usuario.verificarPassword(password)) {
                    return done(null, false, {
                        message: 'Password Incorrecto'
                    })
                }
                // El email existe, y el password correcto
                return done(null, usuario);
            } catch (error) {
                // Ese usuario no existe
                return done(null, false, {
                    message: 'Esa cuenta no existe'
                })
            }
        }
    )
);
//
// In order to help keep authentication state across HTTP requests,
// Sequelize needs to serialize and deserialize the user
// Just consider this part boilerplate needed to make it all work
passport.serializeUser(function (usuario, cb) {
    cb(null, usuario);
});
//
passport.deserializeUser(function (obj, cb) {
    cb(null, obj);
});
//
// Exporting our configured passport
module.exports = passport;
