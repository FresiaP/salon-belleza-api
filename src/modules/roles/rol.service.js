const repository = require("./rol.repository");

const rol_service = {
  async getAllRoles(params) {
    return repository.getRoles(params);
  },

  async getRolById(id_rol) {
    return repository.getRolById(id_rol);
  },

  async createRol(data) {
    return repository.createRol(data);
  },

  async updateRol(id_rol, data) {
    return repository.updateRol(id_rol, data);
  },

  async deleteRol(id_rol) {
    return repository.deleteRol(id_rol);
  },
};

module.exports = rol_service;
