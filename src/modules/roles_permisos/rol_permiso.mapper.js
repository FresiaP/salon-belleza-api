const toRolPermisoDTO = (data) => ({
  rol: {
    id: data.rol.id_rol,
    nombre: data.rol.nombre_rol,
  },
  permisos: (data.permisos || []).map((permiso) => ({
    id: permiso.id_permiso,
    nombre: permiso.nombre_permiso,
  })),
});

module.exports = {
  toRolPermisoDTO,
};
