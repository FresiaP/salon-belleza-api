const toEspecialidadDTO = (esp) => {
  const dto = {
    id: esp.id_especialidad,
    nombre: esp.nombre_especialidad,
    estado: esp.estado,
  };

  if (esp.creado_por) dto.creado_por = esp.creado_por;
  if (esp.fecha_creacion) dto.fecha_creacion = esp.fecha_creacion;
  if (esp.modificado_por) dto.modificado_por = esp.modificado_por;
  if (esp.fecha_modificacion) dto.fecha_modificacion = esp.fecha_modificacion;

  return dto;
};

const toEspecialidadListDTO = (especialidades = []) =>
  especialidades.map(toEspecialidadDTO);

module.exports = {
  toEspecialidadDTO,
  toEspecialidadListDTO,
};
