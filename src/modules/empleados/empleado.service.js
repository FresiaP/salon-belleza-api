const repository = require("./empleado.repository");

const empleado_service = {
  async getAllEmpleados(params) {
    return repository.getEmpleados(params);
  },

  async getEmpleadoById(id) {
    return repository.getEmpleadoById(id);
  },

  async createEmpleado(data) {
    return repository.createEmpleado(data);
  },

  async updateEmpleado(id, data) {
    return repository.updateEmpleado(id, data);
  },

  async updateEstado(data) {
    return repository.updateEstado(data);
  },

  async deleteEmpleado(id) {
    return repository.deleteEmpleado(id);
  },
};

module.exports = empleado_service;
