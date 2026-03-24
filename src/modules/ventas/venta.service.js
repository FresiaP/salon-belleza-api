const repository = require("./venta.repository");

const venta_service = {
  async getAllVentas(params) {
    return repository.getVentas(params);
  },

  async getVentaById(id_venta) {
    return repository.getVentaById(id_venta);
  },

  async createVenta(data) {
    return repository.createVenta(data);
  },

  async updateVenta(id_venta, data) {
    return repository.updateVenta(id_venta, data);
  },

  async deleteVenta(id_venta) {
    return repository.deleteVenta(id_venta);
  },
};

module.exports = venta_service;
