const { poolPromise, sql } = require("../../config/db");

const baseSelect = `
SELECT
  i.id_incidencia,
  i.id_activo,
  a.nombre_identificador,
  i.titulo,
  i.detalle,
  i.prioridad,
  i.fecha_reporte,
  i.creado_por,
  i.fecha_creacion,
  i.modificado_por,
  i.fecha_modificacion
FROM incidencia i
INNER JOIN activo a ON i.id_activo = a.id_activo`;

const countBaseFrom = `
FROM incidencia i
INNER JOIN activo a ON i.id_activo = a.id_activo`;

const sortFields = {
  id_incidencia: "i.id_incidencia",
  id_activo: "i.id_activo",
  titulo: "i.titulo",
  prioridad: "i.prioridad",
  fecha_reporte: "i.fecha_reporte",
  nombre_identificador: "a.nombre_identificador",
  fecha_creacion: "i.fecha_creacion",
  fecha_modificacion: "i.fecha_modificacion",
};

const incidencia_repository = {
  async getIncidencias({ page = 1, limit = 10, search, prioridad, sort, dir }) {
    const pool = await poolPromise;
    const offset = (page - 1) * limit;

    let where = "WHERE 1=1";
    const request = pool.request();

    const sortField = sortFields[sort] || sortFields.id_incidencia;
    const sortDirection = dir === "asc" ? "ASC" : "DESC";

    if (search) {
      where += `
        AND (
          i.titulo LIKE @search
          OR i.detalle LIKE @search
          OR a.nombre_identificador LIKE @search
          OR CAST(i.id_incidencia AS VARCHAR(20)) LIKE @search
        )`;
      request.input("search", sql.NVarChar, `%${search}%`);
    }

    if (prioridad) {
      where += " AND i.prioridad = @prioridad";
      request.input("prioridad", sql.VarChar, prioridad);
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
      ${countBaseFrom}
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

  async getIncidenciaById(id_incidencia) {
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("id_incidencia", sql.Int, id_incidencia).query(`
        ${baseSelect}
        WHERE i.id_incidencia = @id_incidencia
      `);

    return result.recordset[0] || null;
  },

  async createIncidencia({
    id_activo,
    titulo,
    detalle,
    prioridad,
    fecha_reporte,
    creado_por,
  }) {
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("id_activo", sql.Int, id_activo)
      .input("titulo", sql.VarChar, titulo)
      .input("detalle", sql.NVarChar(sql.MAX), detalle)
      .input("prioridad", sql.VarChar, prioridad)
      .input("fecha_reporte", sql.DateTime, fecha_reporte)
      .input("creado_por", sql.Int, creado_por).query(`
        INSERT INTO incidencia (
          id_activo,
          titulo,
          detalle,
          prioridad,
          fecha_reporte,
          creado_por
        )
        OUTPUT INSERTED.id_incidencia
        VALUES (
          @id_activo,
          @titulo,
          @detalle,
          @prioridad,
          @fecha_reporte,
          @creado_por
        )
      `);

    return this.getIncidenciaById(result.recordset[0].id_incidencia);
  },

  async updateIncidencia(
    id_incidencia,
    { id_activo, titulo, detalle, prioridad, fecha_reporte, modificado_por },
  ) {
    const pool = await poolPromise;
    const fields = [];
    const request = pool
      .request()
      .input("id_incidencia", sql.Int, id_incidencia);

    if (id_activo !== undefined) {
      fields.push("id_activo = @id_activo");
      request.input("id_activo", sql.Int, id_activo);
    }

    if (titulo !== undefined) {
      fields.push("titulo = @titulo");
      request.input("titulo", sql.VarChar, titulo);
    }

    if (detalle !== undefined) {
      fields.push("detalle = @detalle");
      request.input("detalle", sql.NVarChar(sql.MAX), detalle ?? null);
    }

    if (prioridad !== undefined) {
      fields.push("prioridad = @prioridad");
      request.input("prioridad", sql.VarChar, prioridad ?? null);
    }

    if (fecha_reporte !== undefined) {
      fields.push("fecha_reporte = @fecha_reporte");
      request.input("fecha_reporte", sql.DateTime, fecha_reporte);
    }

    if (fields.length === 0) {
      return false;
    }

    fields.push("modificado_por = @modificado_por");
    fields.push("fecha_modificacion = GETDATE()");
    request.input("modificado_por", sql.Int, modificado_por);

    const result = await request.query(`
      UPDATE incidencia
      SET ${fields.join(", ")}
      WHERE id_incidencia = @id_incidencia
    `);

    return result.rowsAffected[0] > 0;
  },

  async deleteIncidencia(id_incidencia) {
    const pool = await poolPromise;

    try {
      const result = await pool
        .request()
        .input("id_incidencia", sql.Int, id_incidencia).query(`
          DELETE FROM incidencia
          WHERE id_incidencia = @id_incidencia
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

module.exports = incidencia_repository;
