const { poolPromise, sql } = require("../../config/db");

const baseSelect = `
SELECT
  ip.id_insumo,
  ip.id_protocolo,
  ps.id_activo,
  ap.nombre_identificador AS nombre_activo_protocolo,
  ip.id_activo_producto,
  apr.nombre_identificador AS nombre_activo_producto,
  ip.cantidad_sugerida,
  ip.creado_por,
  ip.fecha_creacion,
  ip.modificado_por,
  ip.fecha_modificacion
FROM insumo_protocolo ip
INNER JOIN protocolo_servicio ps ON ip.id_protocolo = ps.id_protocolo
INNER JOIN activo ap ON ps.id_activo = ap.id_activo
INNER JOIN activo apr ON ip.id_activo_producto = apr.id_activo`;

const countBaseFrom = `
FROM insumo_protocolo ip
INNER JOIN protocolo_servicio ps ON ip.id_protocolo = ps.id_protocolo
INNER JOIN activo ap ON ps.id_activo = ap.id_activo
INNER JOIN activo apr ON ip.id_activo_producto = apr.id_activo`;

const sortFields = {
  id_insumo: "ip.id_insumo",
  id_protocolo: "ip.id_protocolo",
  id_activo_producto: "ip.id_activo_producto",
  cantidad_sugerida: "ip.cantidad_sugerida",
  nombre_activo_protocolo: "ap.nombre_identificador",
  nombre_activo_producto: "apr.nombre_identificador",
  fecha_creacion: "ip.fecha_creacion",
  fecha_modificacion: "ip.fecha_modificacion",
};

const insumo_protocolo_repository = {
  async getInsumosProtocolo({ page = 1, limit = 10, search, sort, dir }) {
    const pool = await poolPromise;
    const offset = (page - 1) * limit;

    let where = "WHERE 1=1";
    const request = pool.request();

    const sortField = sortFields[sort] || sortFields.id_insumo;
    const sortDirection = dir === "asc" ? "ASC" : "DESC";

    if (search) {
      where += `
        AND (
          CAST(ip.id_insumo AS VARCHAR(20)) LIKE @search
          OR CAST(ip.id_protocolo AS VARCHAR(20)) LIKE @search
          OR CAST(ip.id_activo_producto AS VARCHAR(20)) LIKE @search
          OR ap.nombre_identificador LIKE @search
          OR apr.nombre_identificador LIKE @search
          OR ip.cantidad_sugerida LIKE @search
        )`;
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

  async getInsumoProtocoloById(id_insumo) {
    const pool = await poolPromise;

    const result = await pool.request().input("id_insumo", sql.Int, id_insumo)
      .query(`
        ${baseSelect}
        WHERE ip.id_insumo = @id_insumo
      `);

    return result.recordset[0] || null;
  },

  async createInsumoProtocolo({
    id_protocolo,
    id_activo_producto,
    cantidad_sugerida,
    creado_por,
  }) {
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("id_protocolo", sql.Int, id_protocolo)
      .input("id_activo_producto", sql.Int, id_activo_producto)
      .input("cantidad_sugerida", sql.VarChar, cantidad_sugerida)
      .input("creado_por", sql.Int, creado_por).query(`
        INSERT INTO insumo_protocolo (
          id_protocolo,
          id_activo_producto,
          cantidad_sugerida,
          creado_por
        )
        OUTPUT INSERTED.id_insumo
        VALUES (
          @id_protocolo,
          @id_activo_producto,
          @cantidad_sugerida,
          @creado_por
        )
      `);

    return this.getInsumoProtocoloById(result.recordset[0].id_insumo);
  },

  async updateInsumoProtocolo(
    id_insumo,
    { id_protocolo, id_activo_producto, cantidad_sugerida, modificado_por },
  ) {
    const pool = await poolPromise;
    const fields = [];
    const request = pool.request().input("id_insumo", sql.Int, id_insumo);

    if (id_protocolo !== undefined) {
      fields.push("id_protocolo = @id_protocolo");
      request.input("id_protocolo", sql.Int, id_protocolo);
    }

    if (id_activo_producto !== undefined) {
      fields.push("id_activo_producto = @id_activo_producto");
      request.input("id_activo_producto", sql.Int, id_activo_producto);
    }

    if (cantidad_sugerida !== undefined) {
      fields.push("cantidad_sugerida = @cantidad_sugerida");
      request.input(
        "cantidad_sugerida",
        sql.VarChar,
        cantidad_sugerida ?? null,
      );
    }

    if (fields.length === 0) {
      return false;
    }

    fields.push("modificado_por = @modificado_por");
    fields.push("fecha_modificacion = GETDATE()");
    request.input("modificado_por", sql.Int, modificado_por);

    const result = await request.query(`
      UPDATE insumo_protocolo
      SET ${fields.join(", ")}
      WHERE id_insumo = @id_insumo
    `);

    return result.rowsAffected[0] > 0;
  },

  async deleteInsumoProtocolo(id_insumo) {
    const pool = await poolPromise;

    try {
      const result = await pool.request().input("id_insumo", sql.Int, id_insumo)
        .query(`
          DELETE FROM insumo_protocolo
          WHERE id_insumo = @id_insumo
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

module.exports = insumo_protocolo_repository;
