const repository = require("./cliente.repository");

const cliente_service = {
  async getAllClientes(params) {
    return repository.getClientes(params);
  },

  async getClienteById(id) {
    return repository.getClienteById(id);
  },

  async createCliente(data) {
    return repository.createCliente(data);
  },

  async updateCliente(id, data) {
    return repository.updateCliente(id, data);
  },

  async deleteCliente(id) {
    return repository.deleteCliente(id);
  },
};

module.exports = cliente_service;
