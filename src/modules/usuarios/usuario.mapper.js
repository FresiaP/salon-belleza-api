const toUsuarioDTO = (user) => {

    const dto = {
        id: user.id_usuario,
        username: user.username,
        rol: user.id_rol,
        estado: user.estado
    };

    // =============================
    // EMPLEADO ANIDADO
    // =============================
    if (user.id_empleado) {
        dto.empleado = {
            id: user.id_empleado,
            nombre: user.nombre_empleado
        };
    } else {
        dto.empleado = null;
    }

    // =============================
    // AUDITORÍA (solo si existe)
    // =============================
    if (user.creado_por) dto.creado_por = user.creado_por;
    if (user.fecha_creacion) dto.fecha_creacion = user.fecha_creacion;
    if (user.modificado_por) dto.modificado_por = user.modificado_por;
    if (user.fecha_modificacion) dto.fecha_modificacion = user.fecha_modificacion;

    return dto;
};

const toUsuarioListDTO = (users = []) => users.map(toUsuarioDTO);

module.exports = {
    toUsuarioDTO,
    toUsuarioListDTO
};