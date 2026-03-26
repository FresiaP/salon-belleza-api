const repository = require("./permiso.repository");

const permiso_service = {
  async getAllPermisos(params) {
    return repository.getPermisos(params);
  },

  async getPermisoById(id_permiso) {
    return repository.getPermisoById(id_permiso);
  },
};

module.exports = permiso_service;
