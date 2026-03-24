const toCitaServicioDTO = (cita) => {
  const dto = {
    id: cita.id_cita,
    fechaCita: cita.fecha_cita,
    montoFinal: cita.monto_final,
    notasEstilista: cita.notas_estilista,
    cliente: {
      id: cita.id_cliente,
      nombre: cita.nombre_cliente,
    },
    activo: {
      id: cita.id_activo,
      nombre: cita.nombre_activo,
    },
  };

  dto.empleado = cita.id_empleado
    ? {
        id: cita.id_empleado,
        nombre: cita.nombre_empleado,
      }
    : null;

  if (cita.creado_por) dto.creado_por = cita.creado_por;
  if (cita.fecha_creacion) dto.fecha_creacion = cita.fecha_creacion;
  if (cita.modificado_por) dto.modificado_por = cita.modificado_por;
  if (cita.fecha_modificacion) dto.fecha_modificacion = cita.fecha_modificacion;

  return dto;
};

const toCitaServicioListDTO = (citas = []) => citas.map(toCitaServicioDTO);

module.exports = {
  toCitaServicioDTO,
  toCitaServicioListDTO,
};
