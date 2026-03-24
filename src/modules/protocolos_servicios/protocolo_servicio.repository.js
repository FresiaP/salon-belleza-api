const { poolPromise, sql } = require("../../config/db");

const baseSelect = `
SELECT
  ps.id_protocolo,
  ps.id_activo,
  a.nombre_identificador,
  ps.paso_a_paso,
  ps.tiempo_estimado_min,
  ps.precauciones,
  ps.herramientas_necesarias,
  ps.creado_por,
  ps.fecha_creacion,
  ps.modificado_por,
  ps.fecha_modificacion
FROM protocolo_servicio ps
INNER JOIN activo a ON ps.id_activo = a.id_activo`;

const countBaseFrom = `
FROM protocolo_servicio ps
INNER JOIN activo a ON ps.id_activo = a.id_activo`;

const sortFields = {
  id_protocolo: "ps.id_protocolo",
  id_activo: "ps.id_activo",
  tiempo_estimado_min: "ps.tiempo_estimado_min",
  nombre_identificador: "a.nombre_identificador",
  fecha_creacion: "ps.fecha_creacion",
  fecha_modificacion: "ps.fecha_modificacion",
};

const protocolo_servicio_repository = {
  async getProtocolosServicios({ page = 1, limit = 10, search, sort, dir }) {
    const pool = await poolPromise;
    const offset = (page - 1) * limit;

    let where = "WHERE 1=1";
    const request = pool.request();

    const sortField = sortFields[sort] || sortFields.id_protocolo;
    const sortDirection = dir === "asc" ? "ASC" : "DESC";

    if (search) {
      where += `
        AND (
          a.nombre_identificador LIKE @search
          OR ps.paso_a_paso LIKE @search
          OR ps.precauciones LIKE @search
          OR ps.herramientas_necesarias LIKE @search
          OR CAST(ps.id_protocolo AS VARCHAR(20)) LIKE @search
        )`;
      request.input("search", sql.NVarChar, `%${search}%`);
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

  async getProtocoloServicioById(id_protocolo) {
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("id_protocolo", sql.Int, id_protocolo).query(`
        ${baseSelect}
        WHERE ps.id_protocolo = @id_protocolo
      `);

    return result.recordset[0] || null;
  },

  async createProtocoloServicio({
    id_activo,
    paso_a_paso,
    tiempo_estimado_min,
    precauciones,
    herramientas_necesarias,
    creado_por,
  }) {
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("id_activo", sql.Int, id_activo)
      .input("paso_a_paso", sql.NVarChar(sql.MAX), paso_a_paso)
      .input("tiempo_estimado_min", sql.Int, tiempo_estimado_min)
      .input("precauciones", sql.NVarChar(sql.MAX), precauciones)
      .input("herramientas_necesarias", sql.VarChar, herramientas_necesarias)
      .input("creado_por", sql.Int, creado_por).query(`
        INSERT INTO protocolo_servicio (
          id_activo,
          paso_a_paso,
          tiempo_estimado_min,
          precauciones,
          herramientas_necesarias,
          creado_por
        )
        OUTPUT INSERTED.id_protocolo
        VALUES (
          @id_activo,
          @paso_a_paso,
          @tiempo_estimado_min,
          @precauciones,
          @herramientas_necesarias,
          @creado_por
        )
      `);

    return this.getProtocoloServicioById(result.recordset[0].id_protocolo);
  },

  async updateProtocoloServicio(
    id_protocolo,
    {
      id_activo,
      paso_a_paso,
      tiempo_estimado_min,
      precauciones,
      herramientas_necesarias,
      modificado_por,
    },
  ) {
    const pool = await poolPromise;
    const fields = [];
    const request = pool.request().input("id_protocolo", sql.Int, id_protocolo);

    if (id_activo !== undefined) {
      fields.push("id_activo = @id_activo");
      request.input("id_activo", sql.Int, id_activo);
    }

    if (paso_a_paso !== undefined) {
      fields.push("paso_a_paso = @paso_a_paso");
      request.input("paso_a_paso", sql.NVarChar(sql.MAX), paso_a_paso);
    }

    if (tiempo_estimado_min !== undefined) {
      fields.push("tiempo_estimado_min = @tiempo_estimado_min");
      request.input(
        "tiempo_estimado_min",
        sql.Int,
        tiempo_estimado_min ?? null,
      );
    }

    if (precauciones !== undefined) {
      fields.push("precauciones = @precauciones");
      request.input(
        "precauciones",
        sql.NVarChar(sql.MAX),
        precauciones ?? null,
      );
    }

    if (herramientas_necesarias !== undefined) {
      fields.push("herramientas_necesarias = @herramientas_necesarias");
      request.input(
        "herramientas_necesarias",
        sql.VarChar,
        herramientas_necesarias ?? null,
      );
    }

    if (fields.length === 0) {
      return false;
    }

    fields.push("modificado_por = @modificado_por");
    fields.push("fecha_modificacion = GETDATE()");
    request.input("modificado_por", sql.Int, modificado_por);

    const result = await request.query(`
      UPDATE protocolo_servicio
      SET ${fields.join(", ")}
      WHERE id_protocolo = @id_protocolo
    `);

    return result.rowsAffected[0] > 0;
  },

  async deleteProtocoloServicio(id_protocolo) {
    const pool = await poolPromise;

    try {
      const result = await pool
        .request()
        .input("id_protocolo", sql.Int, id_protocolo).query(`
          DELETE FROM protocolo_servicio
          WHERE id_protocolo = @id_protocolo
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

module.exports = protocolo_servicio_repository;
