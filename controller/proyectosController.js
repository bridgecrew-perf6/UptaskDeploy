const Proyectos = require('../models/proyecto');
const Tareas = require('../models/Tareas');


exports.proyectosHome = async (req, res) => {

    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({ where: { usuarioId } });

    res.render('index', {
        nombrePagina: 'Proyectos',
        proyectos
    });
}

exports.formularioProyecto = async (req, res) => {
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({ where: { usuarioId } });

    res.render('nuevoProyecto', {
        nombrePagina: 'Nuevo Proyecto',
        proyectos
    });
}

exports.nuevoProyecto = async (req, res) => {
    //enviar a la consola el body
    // console.log(req.body);
    //validar que haya algo en el input para
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({ where: { usuarioId } });


    const { nombre } = req.body;

    let errores = [];

    if (!nombre) {
        errores.push({ 'texto': 'agrega un nombre al proyecto' })
    }

    //si hay errores en el
    if (errores.length > 0) {
        res.render('nuevoProyecto', {
            nombrePagina: 'nuevo ProAyecto',
            errores,
            proyectos
        })
    } else {
        //insertar en base de datos
        const usuarioId = res.locals.usuario.id;
        await Proyectos.create({ nombre, usuarioId });
        res.redirect('/')
    }
}

exports.proyectoPorUrl = async (req, res) => {
    const usuarioId = res.locals.usuario.id;
    const proyectosPromise = Proyectos.findAll({ where: { usuarioId } });

    const proyectoPromise = Proyectos.findOne({
        where: {
            url: req.params.url,
            usuarioId
        }
    });
    const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise]);

    // Consultar tareas del Proyecto actual

    const tareas = await Tareas.findAll({
        where: {
            poyectoId: proyecto.id
        },
        // include: [
        //     { model: Proyectos }
        // ]
    });

    if (!proyecto) return next();
    // render a la vista
    res.render('tareas', {
        nombrePagina: 'Tareas del Proyecto',
        proyecto,
        proyectos,
        tareas
    })
}

exports.formularioEditar = async (req, res) => {

    const usuarioId = res.locals.usuario.id;

    const proyectosPromise = Proyectos.findAll({ where: { usuarioId } });

    const proyectoPromise = Proyectos.findOne({
        where: {
            id: req.params.id,
            usuarioId
        }
    })

    const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise]);

    res.render('nuevoProyecto', {
        nombrePagina: "Editar Proyecto",
        proyectos,
        proyecto
    })
}

exports.actualizarProyecto = async (req, res) => {
    //enviar a la consola el body
    // console.log(req.body);
    //validar que haya algo en el input para
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({ where: { usuarioId } });

    const { nombre } = req.body;

    let errores = [];

    if (!nombre) {
        errores.push({ 'texto': 'agrega un nombre al proyecto' })
    }

    //si hay errores en el
    if (errores.length > 0) {
        res.render('nuevoProyecto', {
            nombrePagina: 'nuevo Proyecto',
            errores,
            proyectos
        })
    } else {
        //insertar en base de datos

        await Proyectos.update(
            { nombre: nombre },
            { where: { id: req.params.id } }
        );
        res.redirect('/')
    }
}

exports.eliminarProyecto = async (req, res, next) => {
    const { urlProyecto } = req.query;
    const respuesta = await Proyectos.destroy({
        where: {
            url: urlProyecto
        }
    });
    if (!respuesta) {
        return next();
    }
    res.send('Proyecto elimindado correctamente');
}