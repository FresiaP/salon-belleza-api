const { poolPromise, sql } = require("../../config/db");

const baseSelect = `
SELECT
  es.id_equipo,
  es.id_activo,
  a.nombre_identificador,
  es.id_modelo,
  mo.nombre_modelo,
  es.serie,
  es.ultimo_mantenimiento,
  es.creado_por,
  es.fecha_creacion,
  es.modificado_por,
  es.fecha_modificacion
FROM equipo_salon es
INNER JOIN activo a ON es.id_activo = a.id_activo
INNER JOIN modelo mo ON es.id_modelo = mo.id_modelo`;

const countBaseFrom = `
FROM equipo_salon es
INNER JOIN activo a ON es.id_activo = a.id_activo
INNER JOIN modelo mo ON es.id_modelo = mo.id_modelo`;

const sortFields = {
  id_equipo: "es.id_equipo",
  id_activo: "es.id_activo",
  id_modelo: "es.id_modelo",
  serie: "es.serie",
  ultimo_mantenimiento: "es.ultimo_mantenimiento",
  nombre_identificador: "a.nombre_identificador",
  nombre_modelo: "mo.nombre_modelo",
  fecha_creacion: "es.fecha_creacion",
  fecha_modificacion: "es.fecha_modificacion",
};

const equipo_salon_repository = {
  async getEquiposSalon({ page = 1, limit = 10, search, sort, dir }) {
    const pool = await poolPromise;
    const safePage = Math.max(parseInt(page, 10) || 1, 1);
    const safeLimit = Math.max(parseInt(limit, 10) || 10, 1);
    const rowStart = (safePage - 1) * safeLimit + 1;
    const rowEnd = rowStart + safeLimit - 1;

    let where = "WHERE 1=1";
    const request = pool.request();

    const sortField = sort || "id_equipo";
    const sortDirection = dir === "asc" ? "ASC" : "DESC";

    if (search) {
      where += `
        AND (
          CAST(es.id_equipo AS VARCHAR(20)) LIKE @search
          OR CAST(es.id_activo AS VARCHAR(20)) LIKE @search
          OR CAST(es.id_modelo AS VARCHAR(20)) LIKE @search
          OR a.nombre_identificador LIKE @search
          OR mo.nombre_modelo LIKE @search
          OR es.serie LIKE @search
        )`;
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

  async getEquipoSalonById(id_equipo) {
    const pool = await poolPromise;

    const result = await pool.request().input("id_equipo", sql.Int, id_equipo)
      .query(`
        ${baseSelect}
        WHERE es.id_equipo = @id_equipo
      `);

    return result.recordset[0] || null;
  },

  async createEquipoSalon({
    id_activo,
    id_modelo,
    serie,
    ultimo_mantenimiento,
    creado_por,
  }) {
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("id_activo", sql.Int, id_activo)
      .input("id_modelo", sql.Int, id_modelo)
      .input("serie", sql.VarChar, serie)
      .input("ultimo_mantenimiento", sql.Date, ultimo_mantenimiento)
      .input("creado_por", sql.Int, creado_por).query(`
        INSERT INTO equipo_salon (
          id_activo,
          id_modelo,
          serie,
          ultimo_mantenimiento,
          creado_por
        )
        OUTPUT INSERTED.id_equipo
        VALUES (
          @id_activo,
          @id_modelo,
          @serie,
          @ultimo_mantenimiento,
          @creado_por
        )
      `);

    return this.getEquipoSalonById(result.recordset[0].id_equipo);
  },

  async updateEquipoSalon(
    id_equipo,
    { id_activo, id_modelo, serie, ultimo_mantenimiento, modificado_por },
  ) {
    const pool = await poolPromise;
    const fields = [];
    const request = pool.request().input("id_equipo", sql.Int, id_equipo);

    if (id_activo !== undefined) {
      fields.push("id_activo = @id_activo");
      request.input("id_activo", sql.Int, id_activo);
    }

    if (id_modelo !== undefined) {
      fields.push("id_modelo = @id_modelo");
      request.input("id_modelo", sql.Int, id_modelo);
    }

    if (serie !== undefined) {
      fields.push("serie = @serie");
      request.input("serie", sql.VarChar, serie ?? null);
    }

    if (ultimo_mantenimiento !== undefined) {
      fields.push("ultimo_mantenimiento = @ultimo_mantenimiento");
      request.input(
        "ultimo_mantenimiento",
        sql.Date,
        ultimo_mantenimiento ?? null,
      );
    }

    if (fields.length === 0) {
      return false;
    }

    fields.push("modificado_por = @modificado_por");
    fields.push("fecha_modificacion = GETDATE()");
    request.input("modificado_por", sql.Int, modificado_por);

    const result = await request.query(`
      UPDATE equipo_salon
      SET ${fields.join(", ")}
      WHERE id_equipo = @id_equipo
    `);

    return result.rowsAffected[0] > 0;
  },

  async deleteEquipoSalon(id_equipo) {
    const pool = await poolPromise;

    try {
      const result = await pool.request().input("id_equipo", sql.Int, id_equipo)
        .query(`
          DELETE FROM equipo_salon
          WHERE id_equipo = @id_equipo
        `);

      return result.rowsAffected[0] > 0;
    } catch (error) {
      if (
        error.number === 547 ||
        error.number === 2627 ||
        error.number === 2601
      ) {
        const customError = new Error("FK_CONSTRAINT");
        customError.code = "FK_CONSTRAINT";
        throw customError;
      }

      throw error;
    }
  },
};

module.exports = equipo_salon_repository;
