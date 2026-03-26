const toClienteDTO = (cli) => {
  const dto = {
    id: cli.id_cliente,
    nombre: cli.nombre ?? cli.nombre_cliente,
    telefono: cli.telefono,
    email: cli.email,
    fechaNacimiento: cli.fecha_nacimiento,
  };

  // =============================
  // AUDITORÍA (opcional)
  // =============================
  if (cli.creado_por) dto.creado_por = cli.creado_por;
  if (cli.fecha_creacion) dto.fecha_creacion = cli.fecha_creacion;
  if (cli.modificado_por) dto.modificado_por = cli.modificado_por;
  if (cli.fecha_modificacion) dto.fecha_modificacion = cli.fecha_modificacion;

  return dto;
};

const toClienteListDTO = (clientes = []) => clientes.map(toClienteDTO);

module.exports = {
  toClienteDTO,
  toClienteListDTO,
};
