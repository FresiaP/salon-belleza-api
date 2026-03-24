// src/models/marcas/marca.repository.js
// Maneja la base de datos
const { poolPromise, sql } = require("../../config/db");

const baseSelect = `
SELECT
  id_marca,
  nombre_marca,
  sitio_web,
  estado,
  creado_por,
  fecha_creacion,
  modificado_por,
FROM marca`;

const marca_repository = {
  // Listar marcas
  async getMarcas({ page = 1, limit = 10, search, estado, sort, dir }) {
    const pool = await poolPromise;

    const offset = (page - 1) * limit;

    let where = "WHERE 1=1";
    const request = pool.request();

    // =========================================
    // WHITELIST (evita SQL Injection en sort)
    // =========================================
    const allowedSortFields = ["id_marca", "nombre_marca", "estado"];
    const sortField = allowedSortFields.includes(sort) ? sort : "id_marca";
    const sortDirection = dir === "asc" ? "ASC" : "DESC";

    // =========================================

    if (search) {
      where += " AND nombre_marca LIKE @search";
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
        FROM marca
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

  async getMarcaById(id_marca) {
    const pool = await poolPromise;

    const result = await pool.request().input("id_marca", sql.Int, id_marca)
      .query(`
                ${baseSelect}
                WHERE id_marca = @id_marca
            `);

    return result.recordset[0] || null;
  },

  // Crear marca
  async createMarca({ nombre_marca, sitio_web }) {
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("nombre_marca", sql.VarChar, nombre_marca)
      .input("sitio_web", sql.VarChar, sitio_web).query(`
    INSERT INTO marca (nombre_marca, sitio_web)
    OUTPUT INSERTED.*
    VALUES (@nombre_marca, @sitio_web)
`);

    return result.recordset[0];
  },

  // Actualizar marca
  async updateMarca(id_marca, { nombre_marca, sitio_web, estado }) {
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("id_marca", sql.Int, id_marca)
      .input("nombre_marca", sql.VarChar, nombre_marca)
      .input("sitio_web", sql.VarChar, sitio_web)
      .input("estado", sql.Bit, estado).query(`
            UPDATE marca
            SET nombre_marca = @nombre_marca,
                sitio_web = @sitio_web,
                estado = @estado
            WHERE id_marca = @id_marca
        `);

    return result.rowsAffected[0] > 0;
  },
  // Cambiar solo el estado
  async updateEstado({ id_marca, estado }) {
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("id_marca", sql.Int, id_marca)
      .input("estado", sql.Bit, estado)
      .input("modificado_por", sql.Int, modificado_por).query(`
            UPDATE marca
            SET estado = @estado,
                modificado_por = @modificado_por,
                fecha_modificacion = GETDATE()
            WHERE id_marca = @id_marca
        `);

    return result.rowsAffected[0] > 0;
  },
  // Eliminar marca
  async deleteMarca(id_marca) {
    const pool = await poolPromise;
    try {
      const result = await pool.request().input("id_marca", sql.Int, id_marca)
        .query(`
        DELETE FROM marca
        WHERE id_marca = @id_marca
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

module.exports = marca_repository;
