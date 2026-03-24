const repository = require("./tipo_activo.repository");

const tipo_activo_service = {
  async getAllTiposActivos(params) {
    return repository.getTiposActivos(params);
  },

  async getTipoActivoById(id_tipo_activo) {
    return repository.getTipoActivoById(id_tipo_activo);
  },

  async createTipoActivo(data) {
    return repository.createTipoActivo(data);
  },

  async updateTipoActivo(id_tipo_activo, data) {
    return repository.updateTipoActivo(id_tipo_activo, data);
  },

  async deleteTipoActivo(id_tipo_activo) {
    return repository.deleteTipoActivo(id_tipo_activo);
  },
};

module.exports = tipo_activo_service;
