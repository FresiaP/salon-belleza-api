const repository = require("./insumo_protocolo.repository");

const insumo_protocolo_service = {
  async getAllInsumosProtocolo(params) {
    return repository.getInsumosProtocolo(params);
  },

  async getInsumoProtocoloById(id_insumo) {
    return repository.getInsumoProtocoloById(id_insumo);
  },

  async createInsumoProtocolo(data) {
    return repository.createInsumoProtocolo(data);
  },

  async updateInsumoProtocolo(id_insumo, data) {
    return repository.updateInsumoProtocolo(id_insumo, data);
  },

  async deleteInsumoProtocolo(id_insumo) {
    return repository.deleteInsumoProtocolo(id_insumo);
  },
};

module.exports = insumo_protocolo_service;
