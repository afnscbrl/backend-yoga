const Tabela = require('../alunas/Tabela')
const TabelaAulas = require('./Tabela')

const campos = [
    'categoria',
    'descricao',
    'link',
    'data'
]

class Aula {
    constructor({
        id,
        categoria,
        descricao,
        link,
        data
    }) {
        this.id = id,
            this.categoria = categoria,
            this.descricao = descricao,
            this.link = link,
            this.data = data
    }

    async criar() {
        const resultado = await TabelaAulas.inserir({
            categoria: this.categoria.toUpperCase(),
            descricao: this.descricao,
            link: this.link,
            data: this.data
        })
        this.id = resultado.id
    }

    async carregarId() {
        const encontrado = await TabelaAulas.pegarPorId(this.id)
        this.id = encontrado.id,
        this.categoria = encontrado.categoria,
        this.descricao = encontrado.descricao,
        this.link = encontrado.link,
        this.data = encontrado.data
    }

    async atualizar() {
        await TabelaAulas.pegarPorId(this.id)
        const dadosAtualizar = {}
        campos.forEach((campo) => {
            const valor = this[campo]
            if(valor != undefined) {
                dadosAtualizar[campo] = valor
            }
        })
        if(Object.keys(dadosAtualizar).length === 0 || 
            Object.keys(dadosAtualizar) === undefined) {
                throw new Error('Atualizar - Dados nao fornecidos')
        }
        await TabelaAulas.atualizar(this.id, dadosAtualizar)
    }

    remover() {
        return TabelaAulas.remover(this.id)
    }

}

module.exports = Aula