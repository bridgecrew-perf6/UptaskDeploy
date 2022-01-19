const express = require('express');
const routes = require('./routes');
const path = require('path');
const bodyParser = require('body-parser');
const expressvalidator = require('express-validator')
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');
//importar las variables
require('dotenv').config({ path: '.env' })

//helpers
const helpers = require('./helpers');

//Crear conexion a base de datos para

const db = require('./config/db');

//importar el modelo
require('./models/proyecto');
require('./models/Tareas');
require('./models/usuarios');

db.sync()
    .then(() => console.log('Conectado al servidor'))
    .catch(error => console.log(error));


// crear una aplicacion de express com

const app = express();

//donde cargar los estaticos

app.use(express.static('public'));

//habilitar pug
app.set('view engine', 'pug');

//habilitar body parser para leer datos del formalario
app.use(bodyParser.urlencoded({ extended: true }));


//añadir carpeta de vistas
app.set('views engine', path.join(__dirname, './views'));

//agregar flash messages

app.use(flash());

//cookie

app.use(cookieParser());

//permite mantener la session incluso si no estamos haciendo nada
app.use(session({
    secret: 'supersecreto',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

//express validator

//app.use(expressvalidator());

//pasar vardum a la aplicacion del
app.use((req, res, next) => {
    res.locals.vardump = helpers.vardump;
    res.locals.mensajes = req.flash();
    res.locals.usuario = { ...req.user } || null;

    next();
});


app.use("/", routes());

//servidor y puerto
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;

app.listen(port, host, () => {
    console.log('El servidor esta funcionando')
});