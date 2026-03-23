const toMarcaDTO = (esp) => {
  const dto = {
    id: esp.id_marca,
    nombre: esp.nombre_marca,
    sitio: esp.sitio_web,
    estado: esp.estado,
  };

  if (esp.creado_por) dto.creado_por = esp.creado_por;
  if (esp.fecha_creacion) dto.fecha_creacion = esp.fecha_creacion;
  if (esp.modificado_por) dto.modificado_por = esp.modificado_por;
  if (esp.fecha_modificacion) dto.fecha_modificacion = esp.fecha_modificacion;

  return dto;
};

const toMarcaListDTO = (marcas = []) => marcas.map(toMarcaDTO);

module.exports = {
  toMarcaDTO,
  toMarcaListDTO,
};
