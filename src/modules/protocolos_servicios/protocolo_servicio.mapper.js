const toProtocoloServicioDTO = (protocolo) => {
  const dto = {
    id: protocolo.id_protocolo,
    pasoAPaso: protocolo.paso_a_paso,
    tiempoEstimadoMin: protocolo.tiempo_estimado_min,
    precauciones: protocolo.precauciones,
    herramientasNecesarias: protocolo.herramientas_necesarias,
    activo: {
      id: protocolo.id_activo,
      nombre: protocolo.nombre_identificador,
    },
  };

  if (protocolo.creado_por) dto.creado_por = protocolo.creado_por;
  if (protocolo.fecha_creacion) dto.fecha_creacion = protocolo.fecha_creacion;
  if (protocolo.modificado_por) dto.modificado_por = protocolo.modificado_por;
  if (protocolo.fecha_modificacion) {
    dto.fecha_modificacion = protocolo.fecha_modificacion;
  }

  return dto;
};

const toProtocoloServicioListDTO = (protocolos = []) =>
  protocolos.map(toProtocoloServicioDTO);

module.exports = {
  toProtocoloServicioDTO,
  toProtocoloServicioListDTO,
};
