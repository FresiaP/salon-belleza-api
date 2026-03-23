const empleadoMapper = (emp) => ({
  id: emp.id_empleado,
  nombre: emp.nombre_empleado,
  dni: emp.numero_dni,
  fechaNacimiento: emp.fecha_nacimiento,
  telefono: emp.telefono,
  domicilio: emp.domicilio,

  especialidad: emp.id_especialidad
    ? {
        id: emp.id_especialidad,
        nombre: emp.nombre_especialidad,
      }
    : null,

  estado: emp.estado,

  auditoria: {
    creadoPor: emp.creado_por,
    fechaCreacion: emp.fecha_creacion,
    modificadoPor: emp.modificado_por,
    fechaModificacion: emp.fecha_modificacion,
  },
});

module.exports = empleadoMapper;
