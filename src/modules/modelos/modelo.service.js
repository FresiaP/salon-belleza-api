const repository = require("./modelo.repository");

const modelo_service = {
  async getAllModelos(params) {
    return repository.getModelos(params);
  },

  async getModeloById(id_modelo) {
    return repository.getModeloById(id_modelo);
  },

  async createModelo(data) {
    return repository.createModelo(data);
  },

  async updateModelo(id_modelo, data) {
    return repository.updateModelo(id_modelo, data);
  },

  async updateEstado(data) {
    return repository.updateEstado(data);
  },

  async deleteModelo(id_modelo) {
    return repository.deleteModelo(id_modelo);
  },
};

module.exports = modelo_service;
