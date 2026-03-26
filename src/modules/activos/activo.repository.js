const { poolPromise, sql } = require("../../config/db");

const baseSelect = `
SELECT
  a.id_activo,
  a.id_tipo_activo,
  ta.nombre AS nombre_tipo_activo,
  a.id_proveedor,
  p.razon_social,
  a.nombre_identificador,
  a.descripcion,
  a.precio_base,
  a.id_estado_activo,
  ea.nombre_estado,
  a.fecha_registro,
  a.creado_por,
  a.fecha_creacion,
  a.modificado_por,
  a.fecha_modificacion
FROM activo a
INNER JOIN tipo_activo ta ON a.id_tipo_activo = ta.id_tipo_activo
INNER JOIN estado_activo ea ON a.id_estado_activo = ea.id_estado_activo
LEFT JOIN proveedor p ON a.id_proveedor = p.id_proveedor`;

const countBaseFrom = `
FROM activo a
INNER JOIN tipo_activo ta ON a.id_tipo_activo = ta.id_tipo_activo
INNER JOIN estado_activo ea ON a.id_estado_activo = ea.id_estado_activo
LEFT JOIN proveedor p ON a.id_proveedor = p.id_proveedor`;

const sortFields = {
  id_activo: "a.id_activo",
  nombre_identificador: "a.nombre_identificador",
  precio_base: "a.precio_base",
  id_estado_activo: "a.id_estado_activo",
  nombre_estado: "ea.nombre_estado",
  fecha_registro: "a.fecha_registro",
  nombre_tipo_activo: "ta.nombre",
  razon_social: "p.razon_social",
  fecha_creacion: "a.fecha_creacion",
  fecha_modificacion: "a.fecha_modificacion",
};

const activo_repository = {
  async getActivos({
    page = 1,
    limit = 10,
    search,
    id_estado_activo,
    sort,
    dir,
  }) {
    const pool = await poolPromise;
    const safePage = Math.max(parseInt(page, 10) || 1, 1);
    const safeLimit = Math.max(parseInt(limit, 10) || 10, 1);
    const rowStart = (safePage - 1) * safeLimit + 1;
    const rowEnd = rowStart + safeLimit - 1;

    let where = "WHERE 1=1";
    const request = pool.request();

    const sortField = sort || "id_activo";
    const sortDirection = dir === "asc" ? "ASC" : "DESC";

    if (search) {
      where += `
        AND (
          a.nombre_identificador LIKE @search
          OR a.descripcion LIKE @search
          OR ta.nombre LIKE @search
          OR ea.nombre_estado LIKE @search
          OR p.razon_social LIKE @search
          OR CAST(a.id_activo AS VARCHAR(20)) LIKE @search
        )`;
      request.input("search", sql.NVarChar, `%${search}%`);
    }

    if (id_estado_activo !== undefined) {
      where += " AND a.id_estado_activo = @id_estado_activo";
      request.input("id_estado_activo", sql.Int, parseInt(id_estado_activo));
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

  async getActivoById(id_activo) {
    const pool = await poolPromise;

    const result = await pool.request().input("id_activo", sql.Int, id_activo)
      .query(`
        ${baseSelect}
        WHERE a.id_activo = @id_activo
      `);

    return result.recordset[0] || null;
  },

  async createActivo({
    id_tipo_activo,
    id_proveedor,
    nombre_identificador,
    descripcion,
    precio_base,
    id_estado_activo,
    fecha_registro,
    creado_por,
  }) {
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("id_tipo_activo", sql.Int, id_tipo_activo)
      .input("id_proveedor", sql.Int, id_proveedor)
      .input("nombre_identificador", sql.VarChar, nombre_identificador)
      .input("descripcion", sql.NVarChar(sql.MAX), descripcion)
      .input("precio_base", sql.Decimal(10, 2), precio_base)
      .input("id_estado_activo", sql.Int, id_estado_activo)
      .input("fecha_registro", sql.DateTime, fecha_registro)
      .input("creado_por", sql.Int, creado_por).query(`
        INSERT INTO activo (
          id_tipo_activo,
          id_proveedor,
          nombre_identificador,
          descripcion,
          precio_base,
          id_estado_activo,
          fecha_registro,
          creado_por
        )
        OUTPUT INSERTED.id_activo
        VALUES (
          @id_tipo_activo,
          @id_proveedor,
          @nombre_identificador,
          @descripcion,
          @precio_base,
          @id_estado_activo,
          @fecha_registro,
          @creado_por
        )
      `);

    return this.getActivoById(result.recordset[0].id_activo);
  },

  async updateActivo(
    id_activo,
    {
      id_tipo_activo,
      id_proveedor,
      nombre_identificador,
      descripcion,
      precio_base,
      id_estado_activo,
      fecha_registro,
      modificado_por,
    },
  ) {
    const pool = await poolPromise;
    const fields = [];
    const request = pool.request().input("id_activo", sql.Int, id_activo);

    if (id_tipo_activo !== undefined) {
      fields.push("id_tipo_activo = @id_tipo_activo");
      request.input("id_tipo_activo", sql.Int, id_tipo_activo);
    }

    if (id_proveedor !== undefined) {
      fields.push("id_proveedor = @id_proveedor");
      request.input("id_proveedor", sql.Int, id_proveedor ?? null);
    }

    if (nombre_identificador !== undefined) {
      fields.push("nombre_identificador = @nombre_identificador");
      request.input("nombre_identificador", sql.VarChar, nombre_identificador);
    }

    if (descripcion !== undefined) {
      fields.push("descripcion = @descripcion");
      request.input("descripcion", sql.NVarChar(sql.MAX), descripcion ?? null);
    }

    if (precio_base !== undefined) {
      fields.push("precio_base = @precio_base");
      request.input("precio_base", sql.Decimal(10, 2), precio_base ?? null);
    }

    if (id_estado_activo !== undefined) {
      fields.push("id_estado_activo = @id_estado_activo");
      request.input("id_estado_activo", sql.Int, id_estado_activo);
    }

    if (fecha_registro !== undefined) {
      fields.push("fecha_registro = @fecha_registro");
      request.input("fecha_registro", sql.DateTime, fecha_registro);
    }

    if (fields.length === 0) {
      return false;
    }

    fields.push("modificado_por = @modificado_por");
    fields.push("fecha_modificacion = GETDATE()");
    request.input("modificado_por", sql.Int, modificado_por);

    const result = await request.query(`
      UPDATE activo
      SET ${fields.join(", ")}
      WHERE id_activo = @id_activo
    `);

    return result.rowsAffected[0] > 0;
  },

  async updateEstado({ id_activo, id_estado_activo, modificado_por }) {
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("id_activo", sql.Int, id_activo)
      .input("id_estado_activo", sql.Int, id_estado_activo)
      .input("modificado_por", sql.Int, modificado_por).query(`
        UPDATE activo
        SET id_estado_activo = @id_estado_activo,
            modificado_por = @modificado_por,
            fecha_modificacion = GETDATE()
        WHERE id_activo = @id_activo
      `);

    return result.rowsAffected[0] > 0;
  },

  async deleteActivo(id_activo) {
    const pool = await poolPromise;

    try {
      const result = await pool.request().input("id_activo", sql.Int, id_activo)
        .query(`
          DELETE FROM activo
          WHERE id_activo = @id_activo
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

module.exports = activo_repository;
