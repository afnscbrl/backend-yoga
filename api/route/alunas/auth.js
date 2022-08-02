const Aluna = require('./Aluna')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()

module.exports = {
    tokenEmail:
    function tokenEmail(id) {
        const payload = {
            id: id
        }

        const token = jwt.sign(payload, process.env.JWT_KEY || 'senha', {expiresIn: '30m'})

        return token
    },

    autorizaAluna:
    async function autorizaAluna(req) {
        const {email, senha} = req.body
        const aluna = new Aluna({email: email})
        await aluna.carregar()
        
        const senhaValida = await bcrypt.compare(senha, aluna.senha)

        if(!aluna || !senhaValida) {
            throw new Error('Nome ou senha invalidos')
        }

        const payload = {
            id: aluna.id
        }

        const token = jwt.sign(payload, process.env.JWT_KEY || 'senha', {expiresIn: '2h'})

        return [token, aluna]
    },

    verificaAutorizacao:
    async function verificaAutorizacao(token) {
        const payload = jwt.verify(token, process.env.JWT_KEY || 'senha', (err, decoded)=> {
            if(err) {
                throw new Error(err)
            } else {
                return decoded
            }
        })
        const aluna = new Aluna({id: payload.id})
        await aluna.carregarId()
        if (aluna) {
            return aluna
        }else {
            throw new Error('ID inexistente')
        }

    }

}