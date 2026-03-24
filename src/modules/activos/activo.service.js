const repository = require("./activo.repository");

const activo_service = {
  async getAllActivos(params) {
    return repository.getActivos(params);
  },

  async getActivoById(id_activo) {
    return repository.getActivoById(id_activo);
  },

  async createActivo(data) {
    return repository.createActivo(data);
  },

  async updateActivo(id_activo, data) {
    return repository.updateActivo(id_activo, data);
  },

  async updateEstado(data) {
    return repository.updateEstado(data);
  },

  async deleteActivo(id_activo) {
    return repository.deleteActivo(id_activo);
  },
};

module.exports = activo_service;
