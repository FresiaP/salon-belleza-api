const repository = require("./estado_activo.repository");

const estado_activo_service = {
  async getAllEstadosActivos(params) {
    return repository.getEstadosActivos(params);
  },

  async getEstadoActivoById(id_estado_activo) {
    return repository.getEstadoActivoById(id_estado_activo);
  },

  async createEstadoActivo(data) {
    return repository.createEstadoActivo(data);
  },

  async updateEstadoActivo(id_estado_activo, data) {
    return repository.updateEstadoActivo(id_estado_activo, data);
  },

  async deleteEstadoActivo(id_estado_activo) {
    return repository.deleteEstadoActivo(id_estado_activo);
  },
};

module.exports = estado_activo_service;
