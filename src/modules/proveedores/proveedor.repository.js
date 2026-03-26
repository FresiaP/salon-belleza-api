const { poolPromise, sql } = require("../../config/db");

const baseSelect = `
SELECT
  id_proveedor,
  razon_social,
  contacto_nombre,
  telefono,
  email,
  direccion,
  ruc_cedula,
  estado,
  creado_por,
  fecha_creacion,
  modificado_por,
  fecha_modificacion
FROM proveedor`;

const proveedor_repository = {
  // Listar proveedores
  async getProveedores({ page = 1, limit = 10, search, estado, sort, dir }) {
    const pool = await poolPromise;

    const safePage = Math.max(parseInt(page, 10) || 1, 1);
    const safeLimit = Math.max(parseInt(limit, 10) || 10, 1);
    const rowStart = (safePage - 1) * safeLimit + 1;
    const rowEnd = rowStart + safeLimit - 1;

    let where = "WHERE 1=1";
    const request = pool.request();

    // =========================================
    // WHITELIST (evita SQL Injection en sort)
    // =========================================
    const allowedSortFields = [
      "id_proveedor",
      "razon_social",
      "contacto_nombre",
      "telefono",
      "email",
      "direccion",
      "ruc_cedula",
      "estado",
    ];
    const sortField = allowedSortFields.includes(sort) ? sort : "id_proveedor";
    const sortDirection = dir === "asc" ? "ASC" : "DESC";

    // =========================================

    if (search) {
      where += " AND razon_social LIKE @search";
      request.input("search", sql.VarChar, `%${search}%`);
    }

    if (estado !== undefined) {
      where += " AND estado = @estado";
      request.input("estado", sql.Bit, estado === "true");
    }

    const dataQuery = `
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
    `;

    const countQuery = `
        SELECT COUNT(*) as total
        FROM proveedor
        ${where}
    `;

    request.input("rowStart", sql.Int, rowStart);
    request.input("rowEnd", sql.Int, rowEnd);

    const dataResult = await request.query(dataQuery);
    const countResult = await request.query(countQuery);

    return {
      data: dataResult.recordset,
      total: countResult.recordset[0].total,
      page: safePage,
      limit: safeLimit,
      totalPages: Math.ceil(countResult.recordset[0].total / safeLimit),
    };
  },

  // Obtener proveedor por ID
  async getProveedorById(id_proveedor) {
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("id_proveedor", sql.Int, id_proveedor).query(`
            ${baseSelect}
            WHERE id_proveedor = @id_proveedor
        `);

    return result.recordset[0] || null;
  },

  // Crear proveedor
  async createProveedor({
    razon_social,
    contacto_nombre,
    telefono,
    email,
    direccion,
    ruc_cedula,
    creado_por,
  }) {
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("razon_social", sql.VarChar, razon_social)
      .input("contacto_nombre", sql.VarChar, contacto_nombre)
      .input("telefono", sql.VarChar, telefono)
      .input("email", sql.VarChar, email)
      .input("direccion", sql.VarChar, direccion)
      .input("ruc_cedula", sql.VarChar, ruc_cedula)
      .input("creado_por", sql.Int, creado_por).query(`
            INSERT INTO proveedor (razon_social, contacto_nombre, telefono, email, direccion, ruc_cedula,  creado_por)
            OUTPUT INSERTED.*
            VALUES (@razon_social, @contacto_nombre, @telefono, @email, @direccion, @ruc_cedula, @creado_por)
        `);

    return result.recordset[0];
  },

  // Actualizar proveedor
  async updateProveedor(
    id_proveedor,
    {
      razon_social,
      contacto_nombre,
      telefono,
      email,
      direccion,
      ruc_cedula,
      estado,
      modificado_por,
    },
  ) {
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("id_proveedor", sql.Int, id_proveedor)
      .input("razon_social", sql.VarChar, razon_social)
      .input("contacto_nombre", sql.VarChar, contacto_nombre)
      .input("telefono", sql.VarChar, telefono)
      .input("email", sql.VarChar, email)
      .input("direccion", sql.VarChar, direccion)
      .input("ruc_cedula", sql.VarChar, ruc_cedula)
      .input("estado", sql.Bit, estado)
      .input("modificado_por", sql.Int, modificado_por).query(`
            UPDATE proveedor
            SET razon_social = @razon_social,
                contacto_nombre = @contacto_nombre,
                telefono = @telefono,
                email = @email,
                direccion = @direccion,
                ruc_cedula = @ruc_cedula,
                estado = @estado,
                modificado_por = @modificado_por,
                fecha_modificacion = GETDATE()
            WHERE id_proveedor = @id_proveedor
        `);

    return result.rowsAffected[0] > 0;
  },

  // Cambiar solo el estado
  async updateEstado({ id_proveedor, estado, modificado_por }) {
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("id_proveedor", sql.Int, id_proveedor)
      .input("estado", sql.Bit, estado)
      .input("modificado_por", sql.Int, modificado_por).query(`
            UPDATE proveedor
            SET estado = @estado,
                modificado_por = @modificado_por,
                fecha_modificacion = GETDATE()
            WHERE id_especialidad = @id_especialidad
        `);

    return result.rowsAffected[0] > 0;
  },

  // Eliminar proveedor
  async deleteProveedor(id_proveedor) {
    const pool = await poolPromise;
    try {
      const result = await pool
        .request()
        .input("id_proveedor", sql.Int, id_proveedor).query(`
        DELETE FROM proveedor
        WHERE id_proveedor = @id_proveedor
      `);
      return result.rowsAffected[0] > 0;
    } catch (error) {
      // SQL Server FK violation
      if (error.number === 547) {
        const customError = new Error("FK_CONSTRAINT");
        customError.code = "FK_CONSTRAINT";
        throw customError;
      }

      throw error;
    }
  },
};

module.exports = proveedor_repository;
