const toProductoSalonDTO = (producto) => {
  const dto = {
    id: producto.id_producto,
    codigoBarras: producto.codi_barras,
    stockActual: producto.stock_actual,
    stockMinimo: producto.stock_minimo,
    contenidoNeto: producto.contenido_neto,
    activo: {
      id: producto.id_activo,
      nombre: producto.nombre_identificador,
    },
    marca: {
      id: producto.id_marca,
      nombre: producto.nombre_marca,
    },
  };

  if (producto.creado_por) dto.creado_por = producto.creado_por;
  if (producto.fecha_creacion) dto.fecha_creacion = producto.fecha_creacion;
  if (producto.modificado_por) dto.modificado_por = producto.modificado_por;
  if (producto.fecha_modificacion) {
    dto.fecha_modificacion = producto.fecha_modificacion;
  }

  return dto;
};

const toProductoSalonListDTO = (productos = []) =>
  productos.map(toProductoSalonDTO);

module.exports = {
  toProductoSalonDTO,
  toProductoSalonListDTO,
};
