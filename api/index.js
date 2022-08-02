const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
require('dotenv').config()

const  corsOptions = {
    exposedHeaders: ['Authorization', 'firstLogin']
}

app.use(cors(corsOptions))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

const routerAluna = require('./route/alunas')
app.use('/alunas', routerAluna)

const routerContato = require('./route/contato')
app.use('/contato', routerContato)



mongoose.connect(process.env.MONGO_CONNECT, {useNewUrlParser:true})

app.listen(PORT, () => console.log("Api up!"))