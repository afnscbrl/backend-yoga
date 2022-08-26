const mongoose = require('mongoose')
const Schema = mongoose.Schema

const aulasSchema = new Schema({
    categoria: String,
    descricao: String,
    link: String,
    data: String
})

const aulas = mongoose.model('aula', aulasSchema)

module.exports = aulas