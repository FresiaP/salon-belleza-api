// src/models/marcas/marca.service.js
// conecta controller con model
const repository = require("./marca.repository");

const marca_service = {

    async getAllMarcas(params) {
        return await repository.getMarcas(params);
    },

    async getMarcaById(id_marca) {
        return repository.getMarcaById(id_marca);
    },

    async createMarca(data) {
        return await repository.createMarca(data);
    },

    async updateMarca(id_marca, data) {
        return await repository.updateMarca(id_marca, data);
    },

    async updateEstado(data) {
        return await repository.updateEstado(data);
    },

    async deleteMarca(id_marca) {
        return await repository.deleteMarca(id_marca);
    }

};

module.exports = marca_service;