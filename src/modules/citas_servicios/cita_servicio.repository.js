const { poolPromise, sql } = require("../../config/db");

const baseSelect = `
SELECT
  cs.id_cita,
  cs.id_cliente,
  c.nombre AS nombre_cliente,
  cs.id_activo,
  a.nombre_identificador AS nombre_activo,
  cs.id_empleado,
  e.nombre_empleado,
  cs.fecha_cita,
  cs.monto_final,
  cs.notas_estilista,
  cs.creado_por,
  cs.fecha_creacion,
  cs.modificado_por,
  cs.fecha_modificacion
FROM cita_servicio cs
INNER JOIN cliente c ON cs.id_cliente = c.id_cliente
INNER JOIN activo a ON cs.id_activo = a.id_activo
LEFT JOIN empleado e ON cs.id_empleado = e.id_empleado`;

const countBaseFrom = `
FROM cita_servicio cs
INNER JOIN cliente c ON cs.id_cliente = c.id_cliente
INNER JOIN activo a ON cs.id_activo = a.id_activo
LEFT JOIN empleado e ON cs.id_empleado = e.id_empleado`;

const sortFields = {
  id_cita: "cs.id_cita",
  id_cliente: "cs.id_cliente",
  id_activo: "cs.id_activo",
  id_empleado: "cs.id_empleado",
  fecha_cita: "cs.fecha_cita",
  monto_final: "cs.monto_final",
  nombre_cliente: "c.nombre",
  nombre_activo: "a.nombre_identificador",
  nombre_empleado: "e.nombre_empleado",
  fecha_creacion: "cs.fecha_creacion",
  fecha_modificacion: "cs.fecha_modificacion",
};

const cita_servicio_repository = {
  async getCitasServicios({ page = 1, limit = 10, search, sort, dir }) {
    const pool = await poolPromise;
    const offset = (page - 1) * limit;

    let where = "WHERE 1=1";
    const request = pool.request();

    const sortField = sortFields[sort] || sortFields.id_cita;
    const sortDirection = dir === "asc" ? "ASC" : "DESC";

    if (search) {
      where += `
        AND (
          CAST(cs.id_cita AS VARCHAR(20)) LIKE @search
          OR CAST(cs.id_activo AS VARCHAR(20)) LIKE @search
          OR c.nombre LIKE @search
          OR a.nombre_identificador LIKE @search
          OR e.nombre_empleado LIKE @search
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

  async getCitaServicioById(id_cita) {
    const pool = await poolPromise;

    const result = await pool.request().input("id_cita", sql.Int, id_cita)
      .query(`
        ${baseSelect}
        WHERE cs.id_cita = @id_cita
      `);

    return result.recordset[0] || null;
  },

  async createCitaServicio({
    id_cliente,
    id_activo,
    id_empleado,
    fecha_cita,
    monto_final,
    notas_estilista,
    creado_por,
  }) {
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("id_cliente", sql.Int, id_cliente)
      .input("id_activo", sql.Int, id_activo)
      .input("id_empleado", sql.Int, id_empleado)
      .input("fecha_cita", sql.DateTime, fecha_cita)
      .input("monto_final", sql.Decimal(10, 2), monto_final)
      .input("notas_estilista", sql.NVarChar(sql.MAX), notas_estilista)
      .input("creado_por", sql.Int, creado_por).query(`
        INSERT INTO cita_servicio (
          id_cliente,
          id_activo,
          id_empleado,
          fecha_cita,
          monto_final,
          notas_estilista,
          creado_por
        )
        OUTPUT INSERTED.id_cita
        VALUES (
          @id_cliente,
          @id_activo,
          @id_empleado,
          @fecha_cita,
          @monto_final,
          @notas_estilista,
          @creado_por
        )
      `);

    return this.getCitaServicioById(result.recordset[0].id_cita);
  },

  async updateCitaServicio(
    id_cita,
    {
      id_cliente,
      id_activo,
      id_empleado,
      fecha_cita,
      monto_final,
      notas_estilista,
      modificado_por,
    },
  ) {
    const pool = await poolPromise;
    const fields = [];
    const request = pool.request().input("id_cita", sql.Int, id_cita);

    if (id_cliente !== undefined) {
      fields.push("id_cliente = @id_cliente");
      request.input("id_cliente", sql.Int, id_cliente);
    }

    if (id_activo !== undefined) {
      fields.push("id_activo = @id_activo");
      request.input("id_activo", sql.Int, id_activo);
    }

    if (id_empleado !== undefined) {
      fields.push("id_empleado = @id_empleado");
      request.input("id_empleado", sql.Int, id_empleado ?? null);
    }

    if (fecha_cita !== undefined) {
      fields.push("fecha_cita = @fecha_cita");
      request.input("fecha_cita", sql.DateTime, fecha_cita);
    }

    if (monto_final !== undefined) {
      fields.push("monto_final = @monto_final");
      request.input("monto_final", sql.Decimal(10, 2), monto_final ?? null);
    }

    if (notas_estilista !== undefined) {
      fields.push("notas_estilista = @notas_estilista");
      request.input(
        "notas_estilista",
        sql.NVarChar(sql.MAX),
        notas_estilista ?? null,
      );
    }

    if (fields.length === 0) {
      return false;
    }

    fields.push("modificado_por = @modificado_por");
    fields.push("fecha_modificacion = GETDATE()");
    request.input("modificado_por", sql.Int, modificado_por);

    const result = await request.query(`
      UPDATE cita_servicio
      SET ${fields.join(", ")}
      WHERE id_cita = @id_cita
    `);

    return result.rowsAffected[0] > 0;
  },

  async deleteCitaServicio(id_cita) {
    const pool = await poolPromise;

    try {
      const result = await pool.request().input("id_cita", sql.Int, id_cita)
        .query(`
          DELETE FROM cita_servicio
          WHERE id_cita = @id_cita
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

module.exports = cita_servicio_repository;
