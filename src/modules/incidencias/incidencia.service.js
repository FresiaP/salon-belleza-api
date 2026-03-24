const repository = require("./incidencia.repository");

const incidencia_service = {
  async getAllIncidencias(params) {
    return repository.getIncidencias(params);
  },

  async getIncidenciaById(id_incidencia) {
    return repository.getIncidenciaById(id_incidencia);
  },

  async createIncidencia(data) {
    return repository.createIncidencia(data);
  },

  async updateIncidencia(id_incidencia, data) {
    return repository.updateIncidencia(id_incidencia, data);
  },

  async deleteIncidencia(id_incidencia) {
    return repository.deleteIncidencia(id_incidencia);
  },
};

module.exports = incidencia_service;
