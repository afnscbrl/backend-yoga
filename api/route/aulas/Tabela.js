const Modelo = require('../../models/aulas')

module.exports = {

    inserir(aula) {
        return Modelo.create(aula)
    },

    listar() {
        return Modelo.find()
    },

    atualizar(id, dadosAtualizar) {
        return Modelo.findByIdAndUpdate(
            id, dadosAtualizar
        )
    },

    async listarPorCategoria(categoria) {
        try {

            const encontrado = await Modelo.find(
                { categoria: categoria }
            )
            return encontrado
        } catch (err) {
            throw new Error(err)
        }
    },

    async pegarPorId(id) {
        const encontrado = await Modelo.findById(id)
        if (!encontrado) {
            throw new Error("Nao encontrado")
        }
        return encontrado
    },

    remover(id) {
        return Modelo.findByIdAndDelete(id)
    }


}