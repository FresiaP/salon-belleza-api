const { poolPromise, sql } = require("../../config/db");

const baseSelect = `
SELECT
  dv.id_detalle,
  dv.id_venta,
  v.fecha_venta,
  dv.id_activo,
  a.nombre_identificador,
  dv.cantidad,
  dv.precio_unitario,
  dv.subtotal,
  dv.creado_por,
  dv.fecha_creacion,
  dv.modificado_por,
  dv.fecha_modificacion
FROM detalle_venta dv
LEFT JOIN venta v ON dv.id_venta = v.id_venta
LEFT JOIN activo a ON dv.id_activo = a.id_activo`;

const countBaseFrom = `
FROM detalle_venta dv
LEFT JOIN venta v ON dv.id_venta = v.id_venta
LEFT JOIN activo a ON dv.id_activo = a.id_activo`;

const sortFields = {
  id_detalle: "dv.id_detalle",
  id_venta: "dv.id_venta",
  id_activo: "dv.id_activo",
  cantidad: "dv.cantidad",
  precio_unitario: "dv.precio_unitario",
  subtotal: "dv.subtotal",
  fecha_venta: "v.fecha_venta",
  nombre_identificador: "a.nombre_identificador",
  fecha_creacion: "dv.fecha_creacion",
  fecha_modificacion: "dv.fecha_modificacion",
};

const detalle_venta_repository = {
  async getDetallesVenta({ page = 1, limit = 10, search, sort, dir }) {
    const pool = await poolPromise;
    const offset = (page - 1) * limit;

    let where = "WHERE 1=1";
    const request = pool.request();

    const sortField = sortFields[sort] || sortFields.id_detalle;
    const sortDirection = dir === "asc" ? "ASC" : "DESC";

    if (search) {
      where += `
        AND (
          CAST(dv.id_detalle AS VARCHAR(20)) LIKE @search
          OR CAST(dv.id_venta AS VARCHAR(20)) LIKE @search
          OR CAST(dv.id_activo AS VARCHAR(20)) LIKE @search
          OR a.nombre_identificador LIKE @search
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

  async getDetalleVentaById(id_detalle) {
    const pool = await poolPromise;

    const result = await pool.request().input("id_detalle", sql.Int, id_detalle)
      .query(`
        ${baseSelect}
        WHERE dv.id_detalle = @id_detalle
      `);

    return result.recordset[0] || null;
  },

  async createDetalleVenta({
    id_venta,
    id_activo,
    cantidad,
    precio_unitario,
    creado_por,
  }) {
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("id_venta", sql.Int, id_venta)
      .input("id_activo", sql.Int, id_activo)
      .input("cantidad", sql.Int, cantidad)
      .input("precio_unitario", sql.Decimal(10, 2), precio_unitario)
      .input("creado_por", sql.Int, creado_por).query(`
        INSERT INTO detalle_venta (
          id_venta,
          id_activo,
          cantidad,
          precio_unitario,
          creado_por
        )
        OUTPUT INSERTED.id_detalle
        VALUES (
          @id_venta,
          @id_activo,
          @cantidad,
          @precio_unitario,
          @creado_por
        )
      `);

    return this.getDetalleVentaById(result.recordset[0].id_detalle);
  },

  async updateDetalleVenta(
    id_detalle,
    { id_venta, id_activo, cantidad, precio_unitario, modificado_por },
  ) {
    const pool = await poolPromise;
    const fields = [];
    const request = pool.request().input("id_detalle", sql.Int, id_detalle);

    if (id_venta !== undefined) {
      fields.push("id_venta = @id_venta");
      request.input("id_venta", sql.Int, id_venta ?? null);
    }

    if (id_activo !== undefined) {
      fields.push("id_activo = @id_activo");
      request.input("id_activo", sql.Int, id_activo ?? null);
    }

    if (cantidad !== undefined) {
      fields.push("cantidad = @cantidad");
      request.input("cantidad", sql.Int, cantidad);
    }

    if (precio_unitario !== undefined) {
      fields.push("precio_unitario = @precio_unitario");
      request.input("precio_unitario", sql.Decimal(10, 2), precio_unitario);
    }

    if (fields.length === 0) {
      return false;
    }

    fields.push("modificado_por = @modificado_por");
    fields.push("fecha_modificacion = GETDATE()");
    request.input("modificado_por", sql.Int, modificado_por);

    const result = await request.query(`
      UPDATE detalle_venta
      SET ${fields.join(", ")}
      WHERE id_detalle = @id_detalle
    `);

    return result.rowsAffected[0] > 0;
  },

  async deleteDetalleVenta(id_detalle) {
    const pool = await poolPromise;

    try {
      const result = await pool
        .request()
        .input("id_detalle", sql.Int, id_detalle).query(`
          DELETE FROM detalle_venta
          WHERE id_detalle = @id_detalle
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

module.exports = detalle_venta_repository;
