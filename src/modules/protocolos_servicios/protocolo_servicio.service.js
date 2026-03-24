const repository = require("./protocolo_servicio.repository");

const protocolo_servicio_service = {
  async getAllProtocolosServicios(params) {
    return repository.getProtocolosServicios(params);
  },

  async getProtocoloServicioById(id_protocolo) {
    return repository.getProtocoloServicioById(id_protocolo);
  },

  async createProtocoloServicio(data) {
    return repository.createProtocoloServicio(data);
  },

  async updateProtocoloServicio(id_protocolo, data) {
    return repository.updateProtocoloServicio(id_protocolo, data);
  },

  async deleteProtocoloServicio(id_protocolo) {
    return repository.deleteProtocoloServicio(id_protocolo);
  },
};

module.exports = protocolo_servicio_service;
