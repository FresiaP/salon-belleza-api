const repository = require("./proveedor.repository");

const proveedor_service = {
  async getAllProveedores(params) {
    return repository.getProveedores(params);
  },

  async getProveedorById(id_proveedor) {
    return repository.getProveedorById(id_proveedor);
  },

  async createProveedor(data) {
    return repository.createProveedor(data);
  },

  async updateProveedor(id_proveedor, data) {
    return repository.updateProveedor(id_proveedor, data);
  },

  async updateEstado(data) {
    return repository.updateEstado(data);
  },

  async deleteProveedor(id_proveedor) {
    return repository.deleteProveedor(id_proveedor);
  },
};

module.exports = proveedor_service;
