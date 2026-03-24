const toIncidenciaDTO = (incidencia) => {
  const dto = {
    id: incidencia.id_incidencia,
    titulo: incidencia.titulo,
    detalle: incidencia.detalle,
    prioridad: incidencia.prioridad,
    fechaReporte: incidencia.fecha_reporte,
    activo: {
      id: incidencia.id_activo,
      nombre: incidencia.nombre_identificador,
    },
  };

  if (incidencia.creado_por) dto.creado_por = incidencia.creado_por;
  if (incidencia.fecha_creacion) dto.fecha_creacion = incidencia.fecha_creacion;
  if (incidencia.modificado_por) dto.modificado_por = incidencia.modificado_por;
  if (incidencia.fecha_modificacion) {
    dto.fecha_modificacion = incidencia.fecha_modificacion;
  }

  return dto;
};

const toIncidenciaListDTO = (incidencias = []) =>
  incidencias.map(toIncidenciaDTO);

module.exports = {
  toIncidenciaDTO,
  toIncidenciaListDTO,
};
