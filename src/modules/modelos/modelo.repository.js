const { poolPromise, sql } = require("../../config/db");

const baseSelect = `
SELECT
  mo.id_modelo,
  mo.nombre_modelo,
  mo.id_marca,
  m.nombre_marca,
  mo.estado,
  mo.creado_por,
  mo.fecha_creacion,
  mo.modificado_por,
  mo.fecha_modificacion
FROM modelo mo
INNER JOIN marca m ON mo.id_marca = m.id_marca`;

const countBaseFrom = `
FROM modelo mo
INNER JOIN marca m ON mo.id_marca = m.id_marca`;

const sortFields = {
  id_modelo: "mo.id_modelo",
  nombre_modelo: "mo.nombre_modelo",
  id_marca: "mo.id_marca",
  nombre_marca: "m.nombre_marca",
  estado: "mo.estado",
  fecha_creacion: "mo.fecha_creacion",
  fecha_modificacion: "mo.fecha_modificacion",
};

const modelo_repository = {
  async getModelos({ page = 1, limit = 10, search, estado, sort, dir }) {
    const pool = await poolPromise;
    const safePage = Math.max(parseInt(page, 10) || 1, 1);
    const safeLimit = Math.max(parseInt(limit, 10) || 10, 1);
    const rowStart = (safePage - 1) * safeLimit + 1;
    const rowEnd = rowStart + safeLimit - 1;

    let where = "WHERE 1=1";
    const request = pool.request();

    const sortField = sort || "id_modelo";
    const sortDirection = dir === "asc" ? "ASC" : "DESC";

    if (search) {
      where +=
        " AND (mo.nombre_modelo LIKE @search OR m.nombre_marca LIKE @search)";
      request.input("search", sql.VarChar, `%${search}%`);
    }

    if (estado !== undefined) {
      where += " AND mo.estado = @estado";
      request.input(
        "estado",
        sql.Bit,
        estado === true || estado === "true" || estado === 1,
      );
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
      ${countBaseFrom}
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

  async getModeloById(id_modelo) {
    const pool = await poolPromise;

    const result = await pool.request().input("id_modelo", sql.Int, id_modelo)
      .query(`
        ${baseSelect}
        WHERE mo.id_modelo = @id_modelo
      `);

    return result.recordset[0] || null;
  },

  async createModelo({ nombre_modelo, id_marca, estado, creado_por }) {
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("nombre_modelo", sql.VarChar, nombre_modelo)
      .input("id_marca", sql.Int, id_marca)
      .input("estado", sql.Bit, estado)
      .input("creado_por", sql.Int, creado_por).query(`
        INSERT INTO modelo (nombre_modelo, id_marca, estado, creado_por)
        OUTPUT INSERTED.id_modelo
        VALUES (@nombre_modelo, @id_marca, @estado, @creado_por)
      `);

    return this.getModeloById(result.recordset[0].id_modelo);
  },

  async updateModelo(
    id_modelo,
    { nombre_modelo, id_marca, estado, modificado_por },
  ) {
    const pool = await poolPromise;
    const fields = [];
    const request = pool.request().input("id_modelo", sql.Int, id_modelo);

    if (nombre_modelo !== undefined) {
      fields.push("nombre_modelo = @nombre_modelo");
      request.input("nombre_modelo", sql.VarChar, nombre_modelo);
    }

    if (id_marca !== undefined) {
      fields.push("id_marca = @id_marca");
      request.input("id_marca", sql.Int, id_marca);
    }

    if (estado !== undefined) {
      fields.push("estado = @estado");
      request.input("estado", sql.Bit, estado);
    }

    if (fields.length === 0) {
      return false;
    }

    fields.push("modificado_por = @modificado_por");
    fields.push("fecha_modificacion = GETDATE()");
    request.input("modificado_por", sql.Int, modificado_por);

    const result = await request.query(`
      UPDATE modelo
      SET ${fields.join(", ")}
      WHERE id_modelo = @id_modelo
    `);

    return result.rowsAffected[0] > 0;
  },

  async updateEstado({ id_modelo, estado, modificado_por }) {
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("id_modelo", sql.Int, id_modelo)
      .input("estado", sql.Bit, estado)
      .input("modificado_por", sql.Int, modificado_por).query(`
        UPDATE modelo
        SET estado = @estado,
            modificado_por = @modificado_por,
            fecha_modificacion = GETDATE()
        WHERE id_modelo = @id_modelo
      `);

    return result.rowsAffected[0] > 0;
  },

  async deleteModelo(id_modelo) {
    const pool = await poolPromise;

    try {
      const result = await pool.request().input("id_modelo", sql.Int, id_modelo)
        .query(`
          DELETE FROM modelo
          WHERE id_modelo = @id_modelo
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

module.exports = modelo_repository;
