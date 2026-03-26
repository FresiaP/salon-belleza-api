const { poolPromise, sql } = require("../../config/db");

const baseSelect = `
SELECT
  p.id_permiso,
  p.nombre_permiso,
  (
    SELECT COUNT(*)
    FROM rol_permiso rp
    WHERE rp.id_permiso = p.id_permiso
  ) AS total_roles
FROM permiso p`;

const permiso_repository = {
  async getPermisos({ page = 1, limit = 10, search, sort, dir }) {
    const pool = await poolPromise;
    const safePage = Math.max(parseInt(page, 10) || 1, 1);
    const safeLimit = Math.max(parseInt(limit, 10) || 10, 1);
    const rowStart = (safePage - 1) * safeLimit + 1;
    const rowEnd = rowStart + safeLimit - 1;
    let where = "WHERE 1=1";

    const request = pool.request();
    const allowedSortFields = ["id_permiso", "nombre_permiso", "total_roles"];
    const sortField = allowedSortFields.includes(sort) ? sort : "id_permiso";
    const sortDirection = dir === "asc" ? "ASC" : "DESC";

    if (search) {
      where += " AND p.nombre_permiso LIKE @search";
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
      FROM permiso p
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

  async getPermisoById(id_permiso) {
    const pool = await poolPromise;

    const result = await pool.request().input("id_permiso", sql.Int, id_permiso)
      .query(`
        ${baseSelect}
        WHERE p.id_permiso = @id_permiso
      `);

    return result.recordset[0] || null;
  },
};

module.exports = permiso_repository;
