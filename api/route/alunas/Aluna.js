const TabelaAluna = require('./Tabela')
bcrypt = require('bcrypt')

const campos = [
'nome',
'senha',
'email',
'telefone',
'nascimento',
'eCivil',
'filhos',
'profissao', 
'rotina', 
'yogi', 
'modalidade', 
'sono', 
'alimentacao', 
'cuidado', 
'medicacao', 
'emergencia',
'objetivo',
'emailVerified'] // add todos os campos

class Aluna {
    constructor({
    id,
    nome,
    senha,
    email,
    telefone,
    nascimento,
    pacote,
    eCivil,
    filhos,
    profissao, 
    rotina, 
    yogi, 
    modalidade, 
    sono, 
    alimentacao, 
    cuidado, 
    medicacao, 
    emergencia,
    objetivo,
    emailVerified,
    lastLogin,
    ativo
    }) {

        this.id = id,
        this.nome = nome,
        this.email = email,
        this.telefone= telefone,
        this.nascimento= nascimento, 
        this.senha = senha,
        this.pacote = pacote, 
        this.eCivil = eCivil,
        this.filhos = filhos,
        this.profissao = profissao, 
        this.rotina = rotina, 
        this.yogi = yogi, 
        this.modalidade = modalidade, 
        this.sono = sono, 
        this.alimentacao = alimentacao, 
        this.cuidado = cuidado, 
        this.medicacao = medicacao, 
        this.emergencia = emergencia,
        this.objetivo = objetivo, 
        this.emailVerified = emailVerified, 
        this.lastLogin = lastLogin
        this.ativo = ativo
    }

    async criar() {
        //this.validar()
        const resultado = await TabelaAluna.inserir({
            nome: this.nome,
            email: this.email,
            telefone: this.telefone,
            nascimento: this.nascimento,
            pacote: this.pacote,
            senha: await this.gerarSenhaHash(this.senha),
        })
        this.id = resultado.id
    }

    async carregar() {
        const encontrado = await TabelaAluna.pegarPorEmail(this.email)
        if(!encontrado) {
            return encontrado
        }
        this.id = encontrado.id
        this.nome = encontrado.nome,
        this.telefone= encontrado.telefone,
        this.nascimento= encontrado.nascimento
        this.senha = encontrado.senha
        this.eCivil = encontrado.eCivil,
        this.filhos = encontrado.filhos,
        this.profissao = encontrado.profissao, 
        this.rotina = encontrado.rotina, 
        this.yogi = encontrado.yogi, 
        this.modalidade = encontrado.modalidade, 
        this.sono = encontrado.sono, 
        this.alimentacao = encontrado.alimentacao, 
        this.cuidado = encontrado.cuidado, 
        this.medicacao = encontrado.medicacao, 
        this.emergencia = encontrado.emergencia,
        this.objetivo = encontrado.objetivo, 
        this.emailVerified = encontrado.emailVerified, 
        this.lastLogin = encontrado.lastLogin
        this.ativo = encontrado.ativo

        //tudo
    }

    async carregarId() {
        const encontrado = await TabelaAluna.pegarPorId(this.id)
        this.nome = encontrado.nome
        this.email = encontrado.email,
        this.telefone= encontrado.telefone,
        this.nascimento= encontrado.nascimento
        this.senha = encontrado.senha
        this.eCivil = encontrado.eCivil,
        this.filhos = encontrado.filhos,
        this.profissao = encontrado.profissao, 
        this.rotina = encontrado.rotina, 
        this.yogi = encontrado.yogi, 
        this.modalidade = encontrado.modalidade, 
        this.sono = encontrado.sono, 
        this.alimentacao = encontrado.alimentacao, 
        this.cuidado = encontrado.cuidado, 
        this.medicacao = encontrado.medicacao, 
        this.emergencia = encontrado.emergencia,
        this.objetivo = encontrado.objetivo, 
        this.emailVerified = encontrado.emailVerified, 
        this.lastLogin = encontrado.lastLogin
        this.ativo = encontrado.ativo
        //tudo
    }

    async atualizar() {
        await TabelaAluna.pegarPorId(this.id)

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
        await TabelaAluna.atualizar(this.id, dadosAtualizar)
    }

    remover() {
        return TabelaAluna.remover(this.id)
    }

    gerarSenhaHash(senha) {
        const custoHash = 12
        return bcrypt.hash(senha, custoHash)
    }

    validar() {
        campos.forEach(campo => {
            const valor = this[campo]
            if (valor.length === 0) {
                throw console.error("Campo invalido ou nao fornecido");
            }
        })
    }

}

module.exports = Aluna