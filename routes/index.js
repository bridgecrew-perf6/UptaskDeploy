const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
//importar el controlador

const proyectoController = require('../controller/proyectosController');
const tareasController = require('../controller/tareasController');
const usuariosController = require('../controller/usuariosController');
const authController = require('../controller/authController');

module.exports = () => {
    //ruta para el home
    router.get('/',

        authController.usuarioAutenticado,
        proyectoController.proyectosHome);

    router.get('/nuevoProyecto',
        authController.usuarioAutenticado
        , proyectoController.formularioProyecto);

    router.post('/nuevoProyecto/',
        authController.usuarioAutenticado,
        body('nombre').not().isEmpty().trim().escape(),
        proyectoController.nuevoProyecto);

    //listar proyecto
    router.get('/proyectos/:url',
        proyectoController.proyectoPorUrl);

    //Actualizar el proyecto
    router.get('/proyecto/editar/:id',
        authController.usuarioAutenticado,
        proyectoController.formularioEditar);

    router.post('/nuevoProyecto/:id',
        authController.usuarioAutenticado,
        body('nombre').not().isEmpty().trim().escape(),
        proyectoController.actualizarProyecto);

    //Eliminar PRoyecto para
    router.delete('/proyectos/:url',
        authController.usuarioAutenticado,
        proyectoController.eliminarProyecto);


    //Tareas
    router.post('/proyectos/:url',
        authController.usuarioAutenticado,
        tareasController.agregarTarea);

    //actualizar tarea
    router.patch('/tareas/:id',
        authController.usuarioAutenticado,
        tareasController.cambiarEstadoTarea);
    //actualizar tarea
    router.delete('/tareas/:id',
        authController.usuarioAutenticado,
        tareasController.eliminarTarea);

    //Crear nueva cuenta
    router.get('/crear-cuenta', usuariosController.formCrearCuenta);

    router.post('/crear-cuenta', usuariosController.crearCuenta)

    router.get('/iniciar-sesion', usuariosController.forminiciarSesion);

    router.post('/iniciar-sesion', authController.autenticarUsuario);

    router.get('/cerrar-sesion', authController.cerrarSesion);

    router.get('/confirmar/:correo', usuariosController.confirmarCorreo);
    //reestablecer contraseña
    router.get('/reestablecer', usuariosController.formRestablecerPassword);

    router.post('/reestablecer', authController.enviarToken);

    router.get('/reestablecer/:token', authController.validarToken);

    router.post('/reestablecer/:token', authController.actualizarPassword);
    return router;
}