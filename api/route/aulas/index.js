const routerAulas = require('express').Router()
const Aula = require('./Aulas')
const TabelaAulas = require('./Tabela')
const { verificaToken } = require('../middlewares')

routerAulas.use(verificaToken).post('/', async(req, res) => {
    const dadosRecebidos = req.body
    try {
        const aula = new Aula(dadosRecebidos)
        await aula.criar()
        res.sendStatus(200)
    } catch (err) {
        res.status(500).send(err)
    }
})

routerAulas.use(verificaToken).get('/', async (req, res) => {
    try {
        let novaAula = []
        const resultados = await TabelaAulas.listar()
        resultados.forEach((aula) => {
            novaAula.push({
                id: aula.id,
                categoria: aula.categoria,
                link: aula.link,
                data: aula.data
            })
        })
        res.send(JSON.stringify(novaAula))
    } catch(err) {
        res.send(err)
    }
})

routerAulas.use(verificaToken).get('/categoria', async(req, res) => {
    const categ = req.body.categoria
    console.log(categ)
    try {
        let novaAula = []
        const resultados = await TabelaAulas.listarPorCategoria(categ)
        resultados.forEach((aula) => {
            novaAula.push({
                id: aula.id,
                categoria: aula.categoria,
                link: aula.link,
                data: aula.data
            })
        })
        res.send(JSON.stringify(novaAula))
    } catch(err) {
        res.send(err)
    }
})

routerAulas.use(verificaToken).get('/:id', async (req, res) => {
    const id = req.params.id
    try {
        const aula = new Aula({id: id})
        await aula.carregarId()
        res.send(JSON.stringify(aula)).status(200)
    } catch (err) {
        res.send(err)
    }
})

routerAulas.use(verificaToken).put('/:id', async (req, res) => {
    const dadosRecebidos = req.body
    const id = req.params.id
    try {
        const dados = Object.assign({}, dadosRecebidos, {id: id})
        const aula = new Aula(dados)
        await aula.atualizar()
        res.sendStatus(200)
    } catch(err) {
        res.status(500).send(err)
    }
})

routerAulas.use(verificaToken).delete('/', async (req, res) => {
    const dadosRecebidos = req.body
    try{

        const aula = new Aula(dadosRecebidos)
        await aula.remover()
        res.sendStatus(200)
    } catch(err) {
        res.send(err).status(500)
    }
})

module.exports = routerAulas