const nodemailer = require('nodemailer');
const pug = require('pug');
const juice = require('juice');
const htmlToText = require('html-to-text');
const util = require('util');
const emailConfig = require('../config/email');

let transport = nodemailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.port,
    auth: {
        user: emailConfig.user, // generated ethereal user
        pass: emailConfig.pass, // generated ethereal password
    },
})

//generar html content
const generarHtml = (archivo, opciones = {}) => {

    const html = pug.renderFile(`${__dirname}/../views/emails/${archivo}.pug`, opciones)
    return juice(html)
}

exports.enviar = async (opciones) => {
    const html = generarHtml(opciones.archivo, opciones);
    const text = htmlToText.htmlToText(html);
    // send mail with defined transport object
    let info = await transport.sendMail({
        from: '"UpTask " <no-reply@Uptask.com>', // sender address
        to: opciones.usuario.email, // list of receivers
        subject: opciones.subject, // Subject line
        text,// plain text body
        html // html body
    });

    const enviarEmail = util.promisify(transport.sendMail, transport);
    return enviarEmail.call(transport, info)
}



