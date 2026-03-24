const toVentaDTO = (venta) => {
  const dto = {
    id: venta.id_venta,
    fechaVenta: venta.fecha_venta,
    total: venta.total_venta,
  };

  dto.cliente = venta.id_cliente
    ? {
        id: venta.id_cliente,
        nombre: venta.nombre_cliente,
      }
    : null;

  dto.empleado = venta.id_empleado
    ? {
        id: venta.id_empleado,
        nombre: venta.nombre_empleado,
      }
    : null;

  if (venta.creado_por) dto.creado_por = venta.creado_por;
  if (venta.fecha_creacion) dto.fecha_creacion = venta.fecha_creacion;
  if (venta.modificado_por) dto.modificado_por = venta.modificado_por;
  if (venta.fecha_modificacion)
    dto.fecha_modificacion = venta.fecha_modificacion;

  return dto;
};

const toVentaListDTO = (ventas = []) => ventas.map(toVentaDTO);

module.exports = {
  toVentaDTO,
  toVentaListDTO,
};
