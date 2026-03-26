const repository = require("./rol_permiso.repository");

const rol_permiso_service = {
  async getPermisosByRol(id_rol) {
    return repository.getPermisosByRol(id_rol);
  },

  async assignPermiso(id_rol, id_permiso) {
    return repository.assignPermiso(id_rol, id_permiso);
  },

  async removePermiso(id_rol, id_permiso) {
    return repository.removePermiso(id_rol, id_permiso);
  },

  async replacePermisos(id_rol, ids_permisos) {
    return repository.replacePermisos(id_rol, ids_permisos);
  },
};

module.exports = rol_permiso_service;
