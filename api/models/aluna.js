const mongoose = require('mongoose')
const Schema = mongoose.Schema

const alunaSchema = new Schema({
    nome: String,
    email: {
        type: String,
        //unique: true
    },
    telefone: {
        type: Number,
        //unique: true
    },
    nascimento: String,
    senha: String,
    pacote: String,
    eCivil: String,
    filhos: Number,
    profissao: String,
    rotina: String,
    yogi: String,
    modalidade: String,
    sono: String,
    alimentacao: String,
    cuidado: String,
    medicacao: String,
    emergencia: String,
    objetivo: String,
    emailVerified: Boolean,
    lastLogin: String,
    ativo: Boolean
})

const aluna = mongoose.model('aluna', alunaSchema)

module.exports = aluna