const toPermisoDTO = (permiso) => {
  const dto = {
    id: permiso.id_permiso,
    nombre: permiso.nombre_permiso,
  };

  if (permiso.total_roles !== undefined) {
    dto.totalRoles = permiso.total_roles;
  }

  return dto;
};

const toPermisoListDTO = (permisos = []) => permisos.map(toPermisoDTO);

module.exports = {
  toPermisoDTO,
  toPermisoListDTO,
};
