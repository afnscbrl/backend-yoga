const nodemailer = require('nodemailer')
require('dotenv').config()


const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAILFROM,
        pass: process.env.MAILPASS
    }
})

module.exports = {
    mailSender:
    async function (from, to, subject, html, attachs) {
    await transporter.sendMail({
        from: `${from} <${process.env.EMAILFROM}>` ,
        to: to,
        subject: subject,
        attachments: attachs,
        html: `<div>${html}</div>`
    }).then( () => {
        console.log('enviado OK!')
    }).catch(err => {
        throw new Error(err)
    })
}}


