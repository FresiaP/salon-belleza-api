const { poolPromise, sql } = require("../../config/db");

const baseSelect = `
SELECT
  id_especialidad,
  nombre_especialidad,
  estado,
  creado_por,
  fecha_creacion,
  modificado_por,
  fecha_modificacion
FROM especialidad`;

const especialidad_repository = {
  // Listar especialidades
  async getEspecialidades({ page = 1, limit = 10, search, estado, sort, dir }) {
    const pool = await poolPromise;

    const offset = (page - 1) * limit;

    let where = "WHERE 1=1";
    const request = pool.request();

    // =========================================
    // WHITELIST (evita SQL Injection en sort)
    // =========================================
    const allowedSortFields = [
      "id_especialidad",
      "nombre_especialidad",
      "estado",
    ];
    const sortField = allowedSortFields.includes(sort)
      ? sort
      : "id_especialidad";
    const sortDirection = dir === "asc" ? "ASC" : "DESC";

    // =========================================

    if (search) {
      where += " AND nombre_especialidad LIKE @search";
      request.input("search", sql.VarChar, `%${search}%`);
    }

    if (estado !== undefined) {
      where += " AND estado = @estado";
      request.input("estado", sql.Bit, estado === "true");
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
        FROM especialidad
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

  // Obtener especialidad por ID
  async getEspecialidadById(id_especialidad) {
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("id_especialidad", sql.Int, id_especialidad).query(`
            ${baseSelect}
            WHERE id_especialidad = @id_especialidad
        `);

    return result.recordset[0] || null;
  },

  // Crear especialidad
  async createEspecialidad({ nombre_especialidad, estado, creado_por }) {
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("nombre_especialidad", sql.VarChar, nombre_especialidad)
      .input("estado", sql.Bit, estado)
      .input("creado_por", sql.Int, creado_por).query(`
            INSERT INTO especialidad (nombre_especialidad, estado, creado_por)
            OUTPUT INSERTED.*
            VALUES (@nombre_especialidad, @estado, @creado_por)
        `);

    return result.recordset[0];
  },

  // Actualizar especialidad
  async updateEspecialidad(
    id_especialidad,
    { nombre_especialidad, estado, modificado_por },
  ) {
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("id_especialidad", sql.Int, id_especialidad)
      .input("nombre_especialidad", sql.VarChar, nombre_especialidad)
      .input("estado", sql.Bit, estado)
      .input("modificado_por", sql.Int, modificado_por).query(`
            UPDATE especialidad
            SET nombre_especialidad = @nombre_especialidad,
                estado = @estado,
                modificado_por = @modificado_por,
                fecha_modificacion = GETDATE()
            WHERE id_especialidad = @id_especialidad
        `);

    return result.rowsAffected[0] > 0;
  },

  // Cambiar solo el estado
  async updateEstado({ id_especialidad, estado, modificado_por }) {
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("id_especialidad", sql.Int, id_especialidad)
      .input("estado", sql.Bit, estado)
      .input("modificado_por", sql.Int, modificado_por).query(`
            UPDATE especialidad
            SET estado = @estado,
                modificado_por = @modificado_por,
                fecha_modificacion = GETDATE()
            WHERE id_especialidad = @id_especialidad
        `);

    return result.rowsAffected[0] > 0;
  },

  // Eliminar especialidad
  async deleteEspecialidad(id_especialidad) {
    const pool = await poolPromise;
    try {
      const result = await pool
        .request()
        .input("id_especialidad", sql.Int, id_especialidad).query(`
        DELETE FROM especialidad
        WHERE id_especialidad = @id_especialidad
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

module.exports = especialidad_repository;
