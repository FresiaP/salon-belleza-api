const { poolPromise, sql } = require("../../config/db");

const baseSelect = `
SELECT 
    e.id_empleado,
    e.nombre_empleado,
    e.numero_dni,
    e.fecha_nacimiento,
    e.telefono,
    e.domicilio,
    e.id_especialidad,
    s.nombre_especialidad,
    e.estado,
    e.creado_por,
    e.fecha_creacion,
    e.modificado_por,
    e.fecha_modificacion
FROM empleado e
LEFT JOIN especialidad s ON e.id_especialidad = s.id_especialidad
`;

const empleado_repository = {
  // Listar empleados
  async getEmpleados({ page = 1, limit = 10, search, estado, sort, dir }) {
    const pool = await poolPromise;

    const offset = (page - 1) * limit;

    let where = "WHERE 1=1";
    const request = pool.request();

    // =========================================
    // WHITELIST (evita SQL Injection en sort)
    // =========================================
    const allowedSortFields = [
      "id_empleado",
      "nombre_empleado",
      "numero_dni",
      "fecha_nacimiento",
      "telefono",
      "domicilio",
      "id_especialidad",
      "estado",
      "fecha_creacion",
      "fecha_modificacion",
    ];
    const sortField = allowedSortFields.includes(sort) ? sort : "id_empleado";
    const sortDirection = dir === "asc" ? "ASC" : "DESC";

    // =========================================

    if (search) {
      where += " AND e.nombre_empleado LIKE @search";
      request.input("search", sql.VarChar, `%${search}%`);
    }

    if (estado !== undefined) {
      where += " AND estado = @estado";
      request.input("estado", sql.Bit, Boolean(estado));
    }

    const dataQuery = `
        ${baseSelect}
        ${where}
        ORDER BY ${sortField} ${sortDirection}
        OFFSET @offset ROWS
        FETCH NEXT @limit ROWS ONLY
    `;

    const countQuery = `
        SELECT COUNT(*) as total
        FROM empleado e
        ${where}
    `;

    request.input("offset", sql.Int, offset);
    request.input("limit", sql.Int, limit);

    const dataResult = await request.query(dataQuery);
    const countResult = await request.query(countQuery);

    return {
      data: dataResult.recordset,
      total: countResult.recordset[0].total,
      page,
      limit,
      totalPages: Math.ceil(countResult.recordset[0].total / limit),
    };
  },

  // Obtener empleado por ID
  async getEmpleadoById(id_empleado) {
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("id_empleado", sql.Int, id_empleado).query(`
            ${baseSelect}
            WHERE e.id_empleado = @id_empleado
        `);

    return result.recordset[0] || null;
  },

  // Crear empleado
  async createEmpleado({
    nombre_empleado,
    numero_dni,
    fecha_nacimiento,
    telefono,
    domicilio,
    id_especialidad,
    creado_por,
  }) {
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("nombre_empleado", sql.VarChar, nombre_empleado)
      .input("numero_dni", sql.VarChar, numero_dni)
      .input("fecha_nacimiento", sql.Date, fecha_nacimiento)
      .input("telefono", sql.VarChar, telefono)
      .input("domicilio", sql.VarChar, domicilio)
      .input("id_especialidad", sql.Int, id_especialidad)
      .input("creado_por", sql.Int, creado_por).query(`
        INSERT INTO empleado (nombre_empleado, numero_dni, fecha_nacimiento, telefono, domicilio, id_especialidad, creado_por)
        OUTPUT INSERTED.*
        VALUES (@nombre_empleado, @numero_dni, @fecha_nacimiento, @telefono, @domicilio, @id_especialidad, @creado_por)
        `);

    return result.recordset[0];
  },

  // Actualizar empleado
  async updateEmpleado(
    id_empleado,
    {
      nombre_empleado,
      numero_dni,
      fecha_nacimiento,
      telefono,
      domicilio,
      id_especialidad,
      estado,
      modificado_por,
    },
  ) {
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("id_empleado", sql.Int, id_empleado)
      .input("nombre_empleado", sql.VarChar, nombre_empleado)
      .input("numero_dni", sql.VarChar, numero_dni)
      .input("fecha_nacimiento", sql.Date, fecha_nacimiento)
      .input("telefono", sql.VarChar, telefono)
      .input("domicilio", sql.VarChar, domicilio)
      .input("id_especialidad", sql.Int, id_especialidad)
      .input("estado", sql.Bit, estado)
      .input("modificado_por", sql.Int, modificado_por).query(`
            UPDATE empleado
            SET nombre_empleado = @nombre_empleado,
                numero_dni = @numero_dni,
                fecha_nacimiento = @fecha_nacimiento,
                telefono = @telefono,
                domicilio = @domicilio,
                id_especialidad = @id_especialidad,
                estado = @estado,
                modificado_por = @modificado_por,
                fecha_modificacion = GETDATE()
            WHERE id_empleado = @id_empleado
        `);

    return result.rowsAffected[0] > 0;
  },

  // Cambiar solo el estado
  async updateEstado({ id_empleado, estado, modificado_por }) {
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("id_empleado", sql.Int, id_empleado)
      .input("estado", sql.Bit, estado)
      .input("modificado_por", sql.Int, modificado_por).query(`
            UPDATE empleado
            SET estado = @estado,
                modificado_por = @modificado_por,
                fecha_modificacion = GETDATE()
            WHERE id_empleado = @id_empleado
        `);

    return result.rowsAffected[0] > 0;
  },

  // Eliminar empleado
  async deleteEmpleado(id_empleado) {
    const pool = await poolPromise;

    try {
      const result = await pool
        .request()
        .input("id_empleado", sql.Int, id_empleado).query(`
        DELETE FROM empleado
        WHERE id_empleado = @id_empleado
      `);

      return result.rowsAffected[0] > 0;
    } catch (error) {
      // SQL Server FK violation
      if (error.number === 547) {
        const customError = new Error("FK_CONSTRAINT");
        customError.code = "FK_CONSTRAINT";
        throw customError;
      }

      throw error;
    }
  },
};

module.exports = empleado_repository;
