const toDetalleVentaDTO = (detalle) => {
  const dto = {
    id: detalle.id_detalle,
    cantidad: detalle.cantidad,
    precioUnitario: detalle.precio_unitario,
    subtotal: detalle.subtotal,
  };

  dto.venta = detalle.id_venta
    ? {
        id: detalle.id_venta,
        fechaVenta: detalle.fecha_venta,
      }
    : null;

  dto.activo = detalle.id_activo
    ? {
        id: detalle.id_activo,
        nombre: detalle.nombre_identificador,
      }
    : null;

  if (detalle.creado_por) dto.creado_por = detalle.creado_por;
  if (detalle.fecha_creacion) dto.fecha_creacion = detalle.fecha_creacion;
  if (detalle.modificado_por) dto.modificado_por = detalle.modificado_por;
  if (detalle.fecha_modificacion) {
    dto.fecha_modificacion = detalle.fecha_modificacion;
  }

  return dto;
};

const toDetalleVentaListDTO = (detalles = []) =>
  detalles.map(toDetalleVentaDTO);

module.exports = {
  toDetalleVentaDTO,
  toDetalleVentaListDTO,
};
