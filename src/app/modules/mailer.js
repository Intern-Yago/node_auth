const path = require('path')
const nodemailer = require("nodemailer")
const hbs = require('nodemailer-express-handlebars')
require("dotenv").config()

const transport = nodemailer.createTransport({
    host: process.env.HOST_EMAIL,
    port: process.env.PORT_EMAIL,
    auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.PASS_EMAIL
    }
});

transport.use("compile", hbs({
    viewengine: 'handlebars',
    extName: '.html',
    viewPath:path.resolve('./src/resources/mail/'),
}))

module.exports = transport