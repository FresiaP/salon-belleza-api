const { poolPromise, sql } = require("../../config/db");

const baseSelect = `
SELECT
  ps.id_producto,
  ps.id_activo,
  a.nombre_identificador,
  ps.codi_barras,
  ps.id_marca,
  m.nombre_marca,
  ps.stock_actual,
  ps.stock_minimo,
  ps.contenido_neto,
  ps.creado_por,
  ps.fecha_creacion,
  ps.modificado_por,
  ps.fecha_modificacion
FROM producto_salon ps
INNER JOIN activo a ON ps.id_activo = a.id_activo
INNER JOIN marca m ON ps.id_marca = m.id_marca`;

const countBaseFrom = `
FROM producto_salon ps
INNER JOIN activo a ON ps.id_activo = a.id_activo
INNER JOIN marca m ON ps.id_marca = m.id_marca`;

const sortFields = {
  id_producto: "ps.id_producto",
  id_activo: "ps.id_activo",
  codi_barras: "ps.codi_barras",
  id_marca: "ps.id_marca",
  stock_actual: "ps.stock_actual",
  stock_minimo: "ps.stock_minimo",
  contenido_neto: "ps.contenido_neto",
  nombre_identificador: "a.nombre_identificador",
  nombre_marca: "m.nombre_marca",
  fecha_creacion: "ps.fecha_creacion",
  fecha_modificacion: "ps.fecha_modificacion",
};

const producto_salon_repository = {
  async getProductosSalon({ page = 1, limit = 10, search, sort, dir }) {
    const pool = await poolPromise;
    const offset = (page - 1) * limit;

    let where = "WHERE 1=1";
    const request = pool.request();

    const sortField = sortFields[sort] || sortFields.id_producto;
    const sortDirection = dir === "asc" ? "ASC" : "DESC";

    if (search) {
      where += `
        AND (
          CAST(ps.id_producto AS VARCHAR(20)) LIKE @search
          OR CAST(ps.id_activo AS VARCHAR(20)) LIKE @search
          OR ps.codi_barras LIKE @search
          OR a.nombre_identificador LIKE @search
          OR m.nombre_marca LIKE @search
          OR ps.contenido_neto LIKE @search
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

  async getProductoSalonById(id_producto) {
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("id_producto", sql.Int, id_producto).query(`
        ${baseSelect}
        WHERE ps.id_producto = @id_producto
      `);

    return result.recordset[0] || null;
  },

  async createProductoSalon({
    id_activo,
    codi_barras,
    id_marca,
    stock_actual,
    stock_minimo,
    contenido_neto,
    creado_por,
  }) {
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("id_activo", sql.Int, id_activo)
      .input("codi_barras", sql.VarChar, codi_barras)
      .input("id_marca", sql.Int, id_marca)
      .input("stock_actual", sql.Int, stock_actual)
      .input("stock_minimo", sql.Int, stock_minimo)
      .input("contenido_neto", sql.VarChar, contenido_neto)
      .input("creado_por", sql.Int, creado_por).query(`
        INSERT INTO producto_salon (
          id_activo,
          codi_barras,
          id_marca,
          stock_actual,
          stock_minimo,
          contenido_neto,
          creado_por
        )
        OUTPUT INSERTED.id_producto
        VALUES (
          @id_activo,
          @codi_barras,
          @id_marca,
          @stock_actual,
          @stock_minimo,
          @contenido_neto,
          @creado_por
        )
      `);

    return this.getProductoSalonById(result.recordset[0].id_producto);
  },

  async updateProductoSalon(
    id_producto,
    {
      id_activo,
      codi_barras,
      id_marca,
      stock_actual,
      stock_minimo,
      contenido_neto,
      modificado_por,
    },
  ) {
    const pool = await poolPromise;
    const fields = [];
    const request = pool.request().input("id_producto", sql.Int, id_producto);

    if (id_activo !== undefined) {
      fields.push("id_activo = @id_activo");
      request.input("id_activo", sql.Int, id_activo);
    }

    if (codi_barras !== undefined) {
      fields.push("codi_barras = @codi_barras");
      request.input("codi_barras", sql.VarChar, codi_barras ?? null);
    }

    if (id_marca !== undefined) {
      fields.push("id_marca = @id_marca");
      request.input("id_marca", sql.Int, id_marca);
    }

    if (stock_actual !== undefined) {
      fields.push("stock_actual = @stock_actual");
      request.input("stock_actual", sql.Int, stock_actual);
    }

    if (stock_minimo !== undefined) {
      fields.push("stock_minimo = @stock_minimo");
      request.input("stock_minimo", sql.Int, stock_minimo);
    }

    if (contenido_neto !== undefined) {
      fields.push("contenido_neto = @contenido_neto");
      request.input("contenido_neto", sql.VarChar, contenido_neto ?? null);
    }

    if (fields.length === 0) {
      return false;
    }

    fields.push("modificado_por = @modificado_por");
    fields.push("fecha_modificacion = GETDATE()");
    request.input("modificado_por", sql.Int, modificado_por);

    const result = await request.query(`
      UPDATE producto_salon
      SET ${fields.join(", ")}
      WHERE id_producto = @id_producto
    `);

    return result.rowsAffected[0] > 0;
  },

  async deleteProductoSalon(id_producto) {
    const pool = await poolPromise;

    try {
      const result = await pool
        .request()
        .input("id_producto", sql.Int, id_producto).query(`
          DELETE FROM producto_salon
          WHERE id_producto = @id_producto
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

module.exports = producto_salon_repository;
