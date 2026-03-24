const toEquipoSalonDTO = (equipo) => {
  const dto = {
    id: equipo.id_equipo,
    serie: equipo.serie,
    ultimoMantenimiento: equipo.ultimo_mantenimiento,
    activo: {
      id: equipo.id_activo,
      nombre: equipo.nombre_identificador,
    },
    modelo: {
      id: equipo.id_modelo,
      nombre: equipo.nombre_modelo,
    },
  };

  if (equipo.creado_por) dto.creado_por = equipo.creado_por;
  if (equipo.fecha_creacion) dto.fecha_creacion = equipo.fecha_creacion;
  if (equipo.modificado_por) dto.modificado_por = equipo.modificado_por;
  if (equipo.fecha_modificacion) {
    dto.fecha_modificacion = equipo.fecha_modificacion;
  }

  return dto;
};

const toEquipoSalonListDTO = (equipos = []) => equipos.map(toEquipoSalonDTO);

module.exports = {
  toEquipoSalonDTO,
  toEquipoSalonListDTO,
};
