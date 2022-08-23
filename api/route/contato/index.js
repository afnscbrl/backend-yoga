const routerContato = require('express').Router()
const mailer = require('../../mailer')
require('dotenv').config()


routerContato.post('/', async (req, res) => {
    const recieveData = req.body
    mailer.mailSender(
        recieveData.nome, 
        process.env.EMAILTO,
        "Comentário da página de contato do site" ,
        `Email: ${recieveData.email}<br/> Telefone: ${recieveData.telefone}<br/> Comentou:<br/> "${recieveData.comentario}"`)
    res.sendStatus(200)
})

module.exports = routerContato