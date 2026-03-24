const toModeloDTO = (modelo) => {
  const dto = {
    id: modelo.id_modelo,
    nombre: modelo.nombre_modelo,
    estado: modelo.estado,
    marca: {
      id: modelo.id_marca,
      nombre: modelo.nombre_marca,
    },
  };

  if (modelo.creado_por) dto.creado_por = modelo.creado_por;
  if (modelo.fecha_creacion) dto.fecha_creacion = modelo.fecha_creacion;
  if (modelo.modificado_por) dto.modificado_por = modelo.modificado_por;
  if (modelo.fecha_modificacion) {
    dto.fecha_modificacion = modelo.fecha_modificacion;
  }

  return dto;
};

const toModeloListDTO = (modelos = []) => modelos.map(toModeloDTO);

module.exports = {
  toModeloDTO,
  toModeloListDTO,
};
