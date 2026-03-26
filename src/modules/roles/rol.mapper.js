const toRolDTO = (rol) => {
  const dto = {
    id: rol.id_rol,
    nombre: rol.nombre_rol,
  };

  if (rol.total_permisos !== undefined) {
    dto.totalPermisos = rol.total_permisos;
  }

  return dto;
};

const toRolListDTO = (roles = []) => roles.map(toRolDTO);

module.exports = {
  toRolDTO,
  toRolListDTO,
};
