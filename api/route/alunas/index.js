const routerAluna = require('express').Router()
const Aluna = require('./Aluna')
const TabelaAluna = require('./Tabela')
const auth = require('./auth.js')
const { application } = require('express') // esse application pode estar errado, vinculado ao logout
const mailer = require('../../mailer')
const { emailPayment, attachments, emailPassRecover } = require('../../mailer/EmailPagamento')




routerAluna.post('/registro', async (req, res, next) => {

    const dadosRecebidos = req.body
    try {
        const aluna = new Aluna(dadosRecebidos)
        await aluna.criar()
        res.sendStatus(200)

        const re = /[^\s]+/
        const nome = aluna.nome
        const primeiroNome = nome.match(re)
        const id = aluna.id
        const token = auth.tokenEmail(id)
        mailer.mailSender(
            "Raquel", // from
            aluna.email, //to
            "Pagamento e confirmação de cadastro", //subject
            `${emailPayment(primeiroNome, aluna.pacote, token)}`, // html
            attachments(aluna.pacote),
        )

    } catch (err) {
        res.status(500).send(err)
    }

})


routerAluna.get('/', async (req, res, next) => {

    try {
        const resultados = await TabelaAluna.listar()
        res.send(JSON.stringify(resultados))
    } catch (err) {
        res.send(err)
        next(err)
    }
})

routerAluna.post('/login', async (req, res, next) => {
    try {
        const [token, aluna] = await auth.autorizaAluna(req)
        res.set({ 'Authorization': token, 'User': aluna.email })
        //atualizar o campo lastLogin com a data atual
        if(!aluna.eCivil) {
            res.setHeader('firstLogin', 'true')
        }
        res.sendStatus(202)
    } catch (err) {
        res.sendStatus(401)
        next(err)
    }
})

routerAluna.post('/logged', async (req, res, next) => {
    try {
        const token = Object.values(req.body)[0]
        await auth.verificaAutorizacao(token)
        res.sendStatus(202)
    } catch(err) {
        res.sendStatus(401)
        next()
    }
})

routerAluna.get('/logout', async (req, res, next) => {
    try {
        const token = req.get('Authorization')
        if (!token) {
            return res.setHeader('Content-Type', application / json).status(418).json({ messagem: "Voce ja esta deslogado!" })
        }
        await auth.verificaAutorizacao(token)
        res.removeHeader('Authorization', 'User')
    } catch (err) {
        next(err)
    }
})

routerAluna.put('/confirmacao/:token', async (req, res, next) => {
    const token = req.params.token
    try {
        const user = await auth.verificaAutorizacao(token)
        const dadosRecebidos = req.body
        if(Object.keys(dadosRecebidos)[0] !== 'emailVerified') {
            throw new Error("Campo incorreto")
        }
        const dados = Object.assign({}, dadosRecebidos, { id: user.id })
        const aluna = new Aluna(dados)
        await aluna.atualizar()
        res.sendStatus(200)
        next()

    } catch (err) {
        res.status(500).send(err)
        next()
    }
})

routerAluna.put('/anamnese', async (req, res, next) => {
    const dadosRecebidos = req.body
    
    const user = await auth.verificaAutorizacao(req.body.token)
    console.log('user', user)
    delete dadosRecebidos.token
    try {
        const dados = Object.assign({}, dadosRecebidos, { id: user.id })
        const aluna = new Aluna(dados)
        console.log('aluna', aluna)
        await aluna.atualizar()
    } catch(err) {
        res.status(500).send(err)
        next()
    }
})

routerAluna.post('/emailrecover', async (req, res, next) => {
    const dadosRecebidos = req.body.email

    const aluna = new Aluna({ email: dadosRecebidos })
    await aluna.carregar()
    if (!aluna.id) {
        res.status(404)
        next()
    } else {
        const re = /[^\s]+/
        const nome = aluna.nome
        const primeiroNome = nome.match(re)
        const id = aluna.id
        const token = auth.tokenEmail(id)
        mailer.mailSender(
            "Raquel", // from
            aluna.email, //to
            "Link para alterar senha", //subject
            emailPassRecover(primeiroNome, token), // html
        )
        res.sendStatus(200)
        next()
    }
})


// rota de delete e update (verificar se o user eh a quel ou o proprio usuario)


module.exports = routerAluna