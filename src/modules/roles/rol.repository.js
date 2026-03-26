const { poolPromise, sql } = require("../../config/db");

const baseSelect = `
SELECT
  r.id_rol,
  r.nombre_rol,
  (
    SELECT COUNT(*)
    FROM rol_permiso rp
    WHERE rp.id_rol = r.id_rol
  ) AS total_permisos
FROM rol r`;

const rol_repository = {
  async getRoles({ page = 1, limit = 10, search, sort, dir }) {
    const pool = await poolPromise;
    const safePage = Math.max(parseInt(page, 10) || 1, 1);
    const safeLimit = Math.max(parseInt(limit, 10) || 10, 1);
    const rowStart = (safePage - 1) * safeLimit + 1;
    const rowEnd = rowStart + safeLimit - 1;
    let where = "WHERE 1=1";

    const request = pool.request();
    const allowedSortFields = ["id_rol", "nombre_rol", "total_permisos"];
    const sortField = allowedSortFields.includes(sort) ? sort : "id_rol";
    const sortDirection = dir === "asc" ? "ASC" : "DESC";

    if (search) {
      where += " AND r.nombre_rol LIKE @search";
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
      SELECT COUNT(*) AS total
      FROM rol r
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

  async getRolById(id_rol) {
    const pool = await poolPromise;

    const result = await pool.request().input("id_rol", sql.Int, id_rol).query(`
      ${baseSelect}
      WHERE r.id_rol = @id_rol
    `);

    return result.recordset[0] || null;
  },

  async createRol({ nombre_rol }) {
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("nombre_rol", sql.VarChar, nombre_rol).query(`
        INSERT INTO rol (nombre_rol)
        OUTPUT INSERTED.id_rol, INSERTED.nombre_rol
        VALUES (@nombre_rol)
      `);

    return result.recordset[0] || null;
  },

  async updateRol(id_rol, { nombre_rol }) {
    const pool = await poolPromise;
    const fields = [];
    const request = pool.request().input("id_rol", sql.Int, id_rol);

    if (nombre_rol !== undefined) {
      fields.push("nombre_rol = @nombre_rol");
      request.input("nombre_rol", sql.VarChar, nombre_rol);
    }

    if (fields.length === 0) {
      return false;
    }

    const result = await request.query(`
      UPDATE rol
      SET ${fields.join(", ")}
      WHERE id_rol = @id_rol
    `);

    return result.rowsAffected[0] > 0;
  },

  async deleteRol(id_rol) {
    const pool = await poolPromise;

    try {
      const result = await pool.request().input("id_rol", sql.Int, id_rol)
        .query(`
        DELETE FROM rol
        WHERE id_rol = @id_rol
      `);

      return result.rowsAffected[0] > 0;
    } catch (error) {
      if (error.number === 547) {
        const customError = new Error(
          "No se puede eliminar el rol porque tiene datos asociados",
        );
        customError.statusCode = 400;
        throw customError;
      }

      throw error;
    }
  },
};

module.exports = rol_repository;
