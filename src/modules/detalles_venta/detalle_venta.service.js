const repository = require("./detalle_venta.repository");

const detalle_venta_service = {
  async getAllDetallesVenta(params) {
    return repository.getDetallesVenta(params);
  },

  async getDetalleVentaById(id_detalle) {
    return repository.getDetalleVentaById(id_detalle);
  },

  async createDetalleVenta(data) {
    return repository.createDetalleVenta(data);
  },

  async updateDetalleVenta(id_detalle, data) {
    return repository.updateDetalleVenta(id_detalle, data);
  },

  async deleteDetalleVenta(id_detalle) {
    return repository.deleteDetalleVenta(id_detalle);
  },
};

module.exports = detalle_venta_service;
