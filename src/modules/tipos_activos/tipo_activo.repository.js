const { poolPromise, sql } = require("../../config/db");

const baseSelect = `
SELECT
  id_tipo_activo,
  nombre,
  creado_por,
  fecha_creacion,
  modificado_por,
  fecha_modificacion
FROM tipo_activo`;

const tipo_activo_repository = {
  async getTiposActivos({ page = 1, limit = 10, search, sort, dir }) {
    const pool = await poolPromise;
    const offset = (page - 1) * limit;

    let where = "WHERE 1=1";
    const request = pool.request();

    const allowedSortFields = [
      "id_tipo_activo",
      "nombre",
      "fecha_creacion",
      "fecha_modificacion",
    ];
    const sortField = allowedSortFields.includes(sort)
      ? sort
      : "id_tipo_activo";
    const sortDirection = dir === "asc" ? "ASC" : "DESC";

    if (search) {
      where += " AND nombre LIKE @search";
      request.input("search", sql.VarChar, `%${search}%`);
    }

    request.input("offset", sql.Int, offset);
    request.input("limit", sql.Int, limit);

    const dataResult = await request.query(`
      ${baseSelect}
      ${where}
      ORDER BY ${sortField} ${sortDirection}
      OFFSET @offset ROWS
      FETCH NEXT @limit ROWS ONLY
    `);

    const countResult = await request.query(`
      SELECT COUNT(*) as total
      FROM tipo_activo
      ${where}
    `);

    return {
      data: dataResult.recordset,
      total: countResult.recordset[0].total,
      page,
      limit,
      totalPages: Math.ceil(countResult.recordset[0].total / limit),
    };
  },

  async getTipoActivoById(id_tipo_activo) {
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("id_tipo_activo", sql.Int, id_tipo_activo).query(`
        ${baseSelect}
        WHERE id_tipo_activo = @id_tipo_activo
      `);

    return result.recordset[0] || null;
  },

  async createTipoActivo({ nombre, creado_por }) {
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("nombre", sql.VarChar, nombre)
      .input("creado_por", sql.Int, creado_por).query(`
        INSERT INTO tipo_activo (nombre, creado_por)
        OUTPUT INSERTED.*
        VALUES (@nombre, @creado_por)
      `);

    return result.recordset[0];
  },

  async updateTipoActivo(id_tipo_activo, { nombre, modificado_por }) {
    const pool = await poolPromise;
    const fields = [];
    const request = pool
      .request()
      .input("id_tipo_activo", sql.Int, id_tipo_activo);

    if (nombre !== undefined) {
      fields.push("nombre = @nombre");
      request.input("nombre", sql.VarChar, nombre);
    }

    if (fields.length === 0) {
      return false;
    }

    fields.push("modificado_por = @modificado_por");
    fields.push("fecha_modificacion = GETDATE()");
    request.input("modificado_por", sql.Int, modificado_por);

    const result = await request.query(`
      UPDATE tipo_activo
      SET ${fields.join(", ")}
      WHERE id_tipo_activo = @id_tipo_activo
    `);

    return result.rowsAffected[0] > 0;
  },

  async deleteTipoActivo(id_tipo_activo) {
    const pool = await poolPromise;

    try {
      const result = await pool
        .request()
        .input("id_tipo_activo", sql.Int, id_tipo_activo).query(`
          DELETE FROM tipo_activo
          WHERE id_tipo_activo = @id_tipo_activo
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

module.exports = tipo_activo_repository;
