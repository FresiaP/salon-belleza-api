const { poolPromise, sql } = require("../../config/db");

const baseSelect = `
SELECT
  v.id_venta,
  v.id_cliente,
  c.nombre AS nombre_cliente,
  v.id_empleado,
  e.nombre_empleado,
  v.fecha_venta,
  v.total_venta,
  v.creado_por,
  v.fecha_creacion,
  v.modificado_por,
  v.fecha_modificacion
FROM venta v
LEFT JOIN cliente c ON v.id_cliente = c.id_cliente
LEFT JOIN empleado e ON v.id_empleado = e.id_empleado`;

const countBaseFrom = `
FROM venta v
LEFT JOIN cliente c ON v.id_cliente = c.id_cliente
LEFT JOIN empleado e ON v.id_empleado = e.id_empleado`;

const sortFields = {
  id_venta: "v.id_venta",
  fecha_venta: "v.fecha_venta",
  total_venta: "v.total_venta",
  nombre_cliente: "c.nombre",
  nombre_empleado: "e.nombre_empleado",
  fecha_creacion: "v.fecha_creacion",
  fecha_modificacion: "v.fecha_modificacion",
};

const venta_repository = {
  async getVentas({ page = 1, limit = 10, search, sort, dir }) {
    const pool = await poolPromise;
    const safePage = Math.max(parseInt(page, 10) || 1, 1);
    const safeLimit = Math.max(parseInt(limit, 10) || 10, 1);
    const rowStart = (safePage - 1) * safeLimit + 1;
    const rowEnd = rowStart + safeLimit - 1;

    let where = "WHERE 1=1";
    const request = pool.request();

    const sortField = sort || "id_venta";
    const sortDirection = dir === "asc" ? "ASC" : "DESC";

    if (search) {
      where += `
        AND (
          CAST(v.id_venta AS VARCHAR(20)) LIKE @search
          OR c.nombre LIKE @search
          OR e.nombre_empleado LIKE @search
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

  async getVentaById(id_venta) {
    const pool = await poolPromise;

    const result = await pool.request().input("id_venta", sql.Int, id_venta)
      .query(`
        ${baseSelect}
        WHERE v.id_venta = @id_venta
      `);

    return result.recordset[0] || null;
  },

  async createVenta({
    id_cliente,
    id_empleado,
    fecha_venta,
    total_venta,
    creado_por,
  }) {
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("id_cliente", sql.Int, id_cliente ?? null)
      .input("id_empleado", sql.Int, id_empleado ?? null)
      .input("fecha_venta", sql.DateTime, fecha_venta)
      .input("total_venta", sql.Decimal(10, 2), total_venta)
      .input("creado_por", sql.Int, creado_por).query(`
        INSERT INTO venta (id_cliente, id_empleado, fecha_venta, total_venta, creado_por)
        OUTPUT INSERTED.id_venta
        VALUES (@id_cliente, @id_empleado, @fecha_venta, @total_venta, @creado_por)
      `);

    return this.getVentaById(result.recordset[0].id_venta);
  },

  async updateVenta(
    id_venta,
    { id_cliente, id_empleado, fecha_venta, total_venta, modificado_por },
  ) {
    const pool = await poolPromise;
    const fields = [];
    const request = pool.request().input("id_venta", sql.Int, id_venta);

    if (id_cliente !== undefined) {
      fields.push("id_cliente = @id_cliente");
      request.input("id_cliente", sql.Int, id_cliente ?? null);
    }

    if (id_empleado !== undefined) {
      fields.push("id_empleado = @id_empleado");
      request.input("id_empleado", sql.Int, id_empleado ?? null);
    }

    if (fecha_venta !== undefined) {
      fields.push("fecha_venta = @fecha_venta");
      request.input("fecha_venta", sql.DateTime, fecha_venta);
    }

    if (total_venta !== undefined) {
      fields.push("total_venta = @total_venta");
      request.input("total_venta", sql.Decimal(10, 2), total_venta);
    }

    if (fields.length === 0) {
      return false;
    }

    fields.push("modificado_por = @modificado_por");
    fields.push("fecha_modificacion = GETDATE()");
    request.input("modificado_por", sql.Int, modificado_por);

    const result = await request.query(`
      UPDATE venta
      SET ${fields.join(", ")}
      WHERE id_venta = @id_venta
    `);

    return result.rowsAffected[0] > 0;
  },

  async deleteVenta(id_venta) {
    const pool = await poolPromise;

    try {
      const result = await pool.request().input("id_venta", sql.Int, id_venta)
        .query(`
          DELETE FROM venta
          WHERE id_venta = @id_venta
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

module.exports = venta_repository;
