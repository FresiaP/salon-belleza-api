const toTipoActivoDTO = (tipoActivo) => {
  const dto = {
    id: tipoActivo.id_tipo_activo,
    nombre: tipoActivo.nombre,
  };

  if (tipoActivo.creado_por) dto.creado_por = tipoActivo.creado_por;
  if (tipoActivo.fecha_creacion) dto.fecha_creacion = tipoActivo.fecha_creacion;
  if (tipoActivo.modificado_por) {
    dto.modificado_por = tipoActivo.modificado_por;
  }
  if (tipoActivo.fecha_modificacion) {
    dto.fecha_modificacion = tipoActivo.fecha_modificacion;
  }

  return dto;
};

const toTipoActivoListDTO = (tiposActivos = []) =>
  tiposActivos.map(toTipoActivoDTO);

module.exports = {
  toTipoActivoDTO,
  toTipoActivoListDTO,
};
