const toActivoDTO = (activo) => {
  const dto = {
    id: activo.id_activo,
    nombreIdentificador: activo.nombre_identificador,
    descripcion: activo.descripcion,
    precioBase: activo.precio_base,
    fechaRegistro: activo.fecha_registro,
    tipoActivo: {
      id: activo.id_tipo_activo,
      nombre: activo.nombre_tipo_activo,
    },
    estadoActivo: {
      id: activo.id_estado_activo,
      nombre: activo.nombre_estado,
    },
  };

  dto.proveedor = activo.id_proveedor
    ? {
        id: activo.id_proveedor,
        razonSocial: activo.razon_social,
      }
    : null;

  if (activo.creado_por) dto.creado_por = activo.creado_por;
  if (activo.fecha_creacion) dto.fecha_creacion = activo.fecha_creacion;
  if (activo.modificado_por) dto.modificado_por = activo.modificado_por;
  if (activo.fecha_modificacion)
    dto.fecha_modificacion = activo.fecha_modificacion;

  return dto;
};

const toActivoListDTO = (activos = []) => activos.map(toActivoDTO);

module.exports = {
  toActivoDTO,
  toActivoListDTO,
};
