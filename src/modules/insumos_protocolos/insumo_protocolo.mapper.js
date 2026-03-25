const toInsumoProtocoloDTO = (insumo) => {
  const dto = {
    id: insumo.id_insumo,
    cantidadSugerida: insumo.cantidad_sugerida,
    protocolo: {
      id: insumo.id_protocolo,
      activo: {
        id: insumo.id_activo,
        nombre: insumo.nombre_activo_protocolo,
      },
    },
    activoProducto: {
      id: insumo.id_activo_producto,
      nombre: insumo.nombre_activo_producto,
    },
  };

  if (insumo.creado_por) dto.creado_por = insumo.creado_por;
  if (insumo.fecha_creacion) dto.fecha_creacion = insumo.fecha_creacion;
  if (insumo.modificado_por) dto.modificado_por = insumo.modificado_por;
  if (insumo.fecha_modificacion) {
    dto.fecha_modificacion = insumo.fecha_modificacion;
  }

  return dto;
};

const toInsumoProtocoloListDTO = (insumos = []) =>
  insumos.map(toInsumoProtocoloDTO);

module.exports = {
  toInsumoProtocoloDTO,
  toInsumoProtocoloListDTO,
};
