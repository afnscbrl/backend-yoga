const routerAluna = require('express').Router()
const Aluna = require('./Aluna')
const TabelaAluna = require('./Tabela')
const auth = require('./auth.js')
const { application } = require('express') // esse application pode estar errado, vinculado ao logout
const mailer = require('../../mailer')
const { emailPayment, attachments, emailPassRecover, emailCharge } = require('../../mailer/EmailPagamento')
const { verificaToken } = require('../middlewares')




routerAluna.post('/registro', async (req, res) => {

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

routerAluna.post('/login', async (req, res) => {
    try {
        const [token, aluna] = await auth.autorizaAluna(req)
        res.set({ 'Authorization': token})
        //atualizar o campo lastLogin com a data atual
        if(!aluna.eCivil) {
            res.setHeader('firstLogin', 'true')
        }
        res.status(202).send(aluna.email)
    } catch (err) {
        console.log(err)
        res.sendStatus(401)
    }
})



routerAluna.put('/confirmacao/:token', async (req, res) => {
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


    } catch (err) {
        res.status(500).send(err)

    }
})

routerAluna.use(verificaToken).delete('/', async (req, res) => {
    const dadosRecebidos = req.body.email
    try {

        const aluna = new Aluna({ email: dadosRecebidos })
        await aluna.remover()
        res.sendStatus(200)
    } catch(err) {
        res.send(err).status(500)
    }

})



routerAluna.use(verificaToken).get('/', async (req, res) => {

    try {
        let novaAluna = []
        const resultados = await TabelaAluna.listar()
        resultados.forEach((aluna) => {
            novaAluna.push({  
                id: aluna.id,
                nome: aluna.nome,
                telefone: aluna.telefone,
                pacote: aluna.pacote
            })
        })
        res.send(JSON.stringify(novaAluna))
    } catch (err) {
        res.send(err)
        
    }
})

routerAluna.use(verificaToken).get('/:id', async (req, res) => {
    const id = req.params.id
    try {
        const aluna = new Aluna({id: id})
        await aluna.carregarId()
        res.send(JSON.stringify(aluna))
    } catch (err) {
        res.send(err)
        
    }
})

routerAluna.use(verificaToken).put('/:id', async (req, res) => {
    const dadosRecebidos = req.body
    const id = req.params.id
    try {
        const dados = Object.assign({}, dadosRecebidos, { id: id })
        const aluna = new Aluna(dados)
        await aluna.atualizar()
        res.sendStatus(200)
    } catch(err) {
        res.status(500).send(err)
    }
})


routerAluna.use(verificaToken).post('/logged', async (req, res) => {
    try {
        const token = Object.values(req.body)[0]
        const aluna = await auth.verificaAutorizacao(token)
        res.status(202).send(aluna.email)
    } catch(err) {
        res.sendStatus(401)
    }
})

// routerAluna.use(verificaToken).get('/logout', async (req, res, next) => {
//     try {
//         const token = req.get('Authorization')
//         if (!token) {
//             return res.setHeader('Content-Type', application / json).status(418).json({ messagem: "Voce ja esta deslogado!" })
//         }
//         await auth.verificaAutorizacao(token)
//         res.removeHeader('Authorization', 'User')
//     } catch (err) {
//         next(err)
//     }
// })


routerAluna.use(verificaToken).put('/anamnese', async (req, res) => {
    const dadosRecebidos = req.body
    
    const user = await auth.verificaAutorizacao(req.body.token)
    delete dadosRecebidos.token
    try {
        const dados = Object.assign({}, dadosRecebidos, { id: user.id })
        const aluna = new Aluna(dados)
        await aluna.atualizar()
        res.sendStatus(200)
    } catch(err) {
        res.status(500).send(err)

    }
})

routerAluna.use(verificaToken).post('/emailrecover', async (req, res, next) => {
    const dadosRecebidos = req.body.email

    const aluna = new Aluna({ email: dadosRecebidos })
    await aluna.carregar()
    if (!aluna.id) {
        res.status(404)
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
    }
})

routerAluna.use(verificaToken).post('/cobrar', async (req, res) => {
    const dadosRecebidos = req.body
    console.log(dadosRecebidos)
    try {
        const aluna = new Aluna(dadosRecebidos)
        await aluna.carregarId()
        const re = /[^\s]+/
        const nome = aluna.nome
        const primeiroNome = nome.match(re)
        const id = aluna.id
        const token = auth.tokenEmail(id)
        mailer.mailSender(
            "Raquel", // from
            aluna.email, //to
            "Pagamento e confirmação de cadastro", //subject
            `${emailCharge(primeiroNome, aluna.pacote, token)}`, // html
            attachments(aluna.pacote),
        )

    } catch (err) {
        res.status(500).send(err)
    }
})





module.exports = routerAluna