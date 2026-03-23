const repository = require("./especialidad.repository");

const especialidad_service = {
  async getAllEspecialidades(params) {
    return repository.getEspecialidades(params);
  },

  async getEspecialidadById(id) {
    return repository.getEspecialidadById(id);
  },

  async createEspecialidad(data) {
    return repository.createEspecialidad(data);
  },

  async updateEspecialidad(id, data) {
    return repository.updateEspecialidad(id, data);
  },

  async updateEstado(data) {
    return repository.updateEstado(data);
  },

  async deleteEspecialidad(id) {
    return repository.deleteEspecialidad(id);
  },
};

module.exports = especialidad_service;
