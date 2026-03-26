const { poolPromise, sql } = require("../../config/db");

const baseSelect = `
SELECT
  id_estado_activo,
  nombre_estado,
  creado_por,
  fecha_creacion,
  modificado_por,
  fecha_modificacion
FROM estado_activo`;

const estado_activo_repository = {
  async getEstadosActivos({ page = 1, limit = 10, search, sort, dir }) {
    const pool = await poolPromise;
    const safePage = Math.max(parseInt(page, 10) || 1, 1);
    const safeLimit = Math.max(parseInt(limit, 10) || 10, 1);
    const rowStart = (safePage - 1) * safeLimit + 1;
    const rowEnd = rowStart + safeLimit - 1;

    let where = "WHERE 1=1";
    const request = pool.request();

    const allowedSortFields = [
      "id_estado_activo",
      "nombre_estado",
      "fecha_creacion",
      "fecha_modificacion",
    ];
    const sortField = allowedSortFields.includes(sort)
      ? sort
      : "id_estado_activo";
    const sortDirection = dir === "asc" ? "ASC" : "DESC";

    if (search) {
      where += " AND nombre_estado LIKE @search";
      request.input("search", sql.VarChar, `%${search}%`);
    }

    request.input("rowStart", sql.Int, rowStart);
    request.input("rowEnd", sql.Int, rowEnd);

    const dataResult = await request.query(`
      SELECT *
      FROM (
        SELECT
          base_result.*,
          ROW_NUMBER() OVER (ORDER BY ${sortField} ${sortDirection}) AS row_num
        FROM (
          ${baseSelect}
          ${where}
        ) AS base_result
      ) AS paginated
      WHERE row_num BETWEEN @rowStart AND @rowEnd
      ORDER BY row_num
    `);

    const countResult = await request.query(`
      SELECT COUNT(*) as total
      FROM estado_activo
      ${where}
    `);

    return {
      data: dataResult.recordset,
      total: countResult.recordset[0].total,
      page: safePage,
      limit: safeLimit,
      totalPages: Math.ceil(countResult.recordset[0].total / safeLimit),
    };
  },

  async getEstadoActivoById(id_estado_activo) {
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("id_estado_activo", sql.Int, id_estado_activo).query(`
        ${baseSelect}
        WHERE id_estado_activo = @id_estado_activo
      `);

    return result.recordset[0] || null;
  },

  async createEstadoActivo({ nombre_estado, creado_por }) {
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("nombre_estado", sql.VarChar, nombre_estado)
      .input("creado_por", sql.Int, creado_por).query(`
        INSERT INTO estado_activo (nombre_estado, creado_por)
        OUTPUT INSERTED.*
        VALUES (@nombre_estado, @creado_por)
      `);

    return result.recordset[0];
  },

  async updateEstadoActivo(
    id_estado_activo,
    { nombre_estado, modificado_por },
  ) {
    const pool = await poolPromise;
    const fields = [];
    const request = pool
      .request()
      .input("id_estado_activo", sql.Int, id_estado_activo);

    if (nombre_estado !== undefined) {
      fields.push("nombre_estado = @nombre_estado");
      request.input("nombre_estado", sql.VarChar, nombre_estado);
    }

    if (fields.length === 0) {
      return false;
    }

    fields.push("modificado_por = @modificado_por");
    fields.push("fecha_modificacion = GETDATE()");
    request.input("modificado_por", sql.Int, modificado_por);

    const result = await request.query(`
      UPDATE estado_activo
      SET ${fields.join(", ")}
      WHERE id_estado_activo = @id_estado_activo
    `);

    return result.rowsAffected[0] > 0;
  },

  async deleteEstadoActivo(id_estado_activo) {
    const pool = await poolPromise;

    try {
      const result = await pool
        .request()
        .input("id_estado_activo", sql.Int, id_estado_activo).query(`
          DELETE FROM estado_activo
          WHERE id_estado_activo = @id_estado_activo
        `);

      return result.rowsAffected[0] > 0;
    } catch (error) {
      if (error.number === 547) {
        const customError = new Error("FK_CONSTRAINT");
        customError.code = "FK_CONSTRAINT";
        throw customError;
      }

      throw error;
    }
  },
};

module.exports = estado_activo_repository;
