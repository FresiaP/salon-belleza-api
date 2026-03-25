const repository = require("./producto_salon.repository");

const producto_salon_service = {
  async getAllProductosSalon(params) {
    return repository.getProductosSalon(params);
  },

  async getProductoSalonById(id_producto) {
    return repository.getProductoSalonById(id_producto);
  },

  async createProductoSalon(data) {
    return repository.createProductoSalon(data);
  },

  async updateProductoSalon(id_producto, data) {
    return repository.updateProductoSalon(id_producto, data);
  },

  async deleteProductoSalon(id_producto) {
    return repository.deleteProductoSalon(id_producto);
  },
};

module.exports = producto_salon_service;
