const toEstadoActivoDTO = (estadoActivo) => {
  const dto = {
    id: estadoActivo.id_estado_activo,
    nombre: estadoActivo.nombre_estado,
  };

  if (estadoActivo.creado_por) dto.creado_por = estadoActivo.creado_por;
  if (estadoActivo.fecha_creacion) {
    dto.fecha_creacion = estadoActivo.fecha_creacion;
  }
  if (estadoActivo.modificado_por) {
    dto.modificado_por = estadoActivo.modificado_por;
  }
  if (estadoActivo.fecha_modificacion) {
    dto.fecha_modificacion = estadoActivo.fecha_modificacion;
  }

  return dto;
};

const toEstadoActivoListDTO = (estadosActivos = []) =>
  estadosActivos.map(toEstadoActivoDTO);

module.exports = {
  toEstadoActivoDTO,
  toEstadoActivoListDTO,
};
