const Modelo = require('../../models/aluna')

module.exports = {

    inserir(aluna) {
        return Modelo.create(aluna)
    },

    listar() {
        return Modelo.find()
    },

    atualizar(id, dadosAtualizar) {
        return Modelo.findByIdAndUpdate(
            id, dadosAtualizar
        )
    },

    async pegarPorEmail(email) {
        try {

            const encontrado = await Modelo.findOne(
                { email: email }
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