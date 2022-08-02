const auth = require('./alunas/auth')

module.exports = {
    verificaToken:
    async function(req, res, next) {
        try {
            const token = req.get('Authorization')
            await auth.verificaAutorizacao(token, res)
            next()
        } catch (err) {
            res.status(401).send({Error: err.message})
        }
    }
}