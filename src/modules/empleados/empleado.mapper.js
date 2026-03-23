const toEmpleadoDTO = (emp) => {
  const dto = {
    id: emp.id_empleado,
    nombre: emp.nombre_empleado,
    dni: emp.numero_dni,
    fechaNacimiento: emp.fecha_nacimiento,
    telefono: emp.telefono,
    domicilio: emp.domicilio,
    estado: emp.estado,
  };

  // =============================
  // ESPECIALIDAD ANIDADA
  // =============================
  if (emp.id_especialidad) {
    dto.especialidad = {
      id: emp.id_especialidad,
      nombre: emp.nombre_especialidad,
    };
  } else {
    dto.especialidad = null;
  }

  // =============================
  // AUDITORÍA (opcional)
  // =============================
  if (emp.creado_por) dto.creado_por = emp.creado_por;
  if (emp.fecha_creacion) dto.fecha_creacion = emp.fecha_creacion;
  if (emp.modificado_por) dto.modificado_por = emp.modificado_por;
  if (emp.fecha_modificacion) dto.fecha_modificacion = emp.fecha_modificacion;

  return dto;
};

const toEmpleadoListDTO = (empleados = []) => empleados.map(toEmpleadoDTO);

module.exports = {
  toEmpleadoDTO,
  toEmpleadoListDTO,
};
