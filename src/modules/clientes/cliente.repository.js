const { poolPromise, sql } = require("../../config/db");

const baseSelect = `
SELECT
  id_cliente,
  nombre,
  telefono,
  email,
  fecha_nacimiento,
  creado_por,
  fecha_creacion,
  modificado_por,
  fecha_modificacion
FROM cliente`;

const cliente_repository = {
  // Listar clientes
  async getClientes({ page = 1, limit = 10, search, estado, sort, dir }) {
    const pool = await poolPromise;

    const offset = (page - 1) * limit;

    let where = "WHERE 1=1";
    const request = pool.request();

    // =========================================
    // WHITELIST (evita SQL Injection en sort)
    // =========================================
    const allowedSortFields = [
      "id_cliente",
      "nombre",
      "telefono",
      "email",
      "fecha_nacimiento",
    ];
    const sortField = allowedSortFields.includes(sort) ? sort : "id_cliente";
    const sortDirection = dir === "asc" ? "ASC" : "DESC";

    // =========================================

    if (search) {
      where += " AND nombre LIKE @search";
      request.input("search", sql.VarChar, `%${search}%`);
    }

    const dataQuery = `
        ${baseSelect}
        ${where}
        ORDER BY ${sortField} ${sortDirection}
        OFFSET @offset ROWS
        FETCH NEXT @limit ROWS ONLY
    `;

    const countQuery = `
        SELECT COUNT(*) as total
        FROM especialidad
        ${where}
    `;

    request.input("offset", sql.Int, offset);
    request.input("limit", sql.Int, limit);

    const dataResult = await request.query(dataQuery);
    const countResult = await request.query(countQuery);

    return {
      data: dataResult.recordset,
      total: countResult.recordset[0].total,
      page,
      limit,
      totalPages: Math.ceil(countResult.recordset[0].total / limit),
    };
  },

  // Obtener cliente por ID
  async getClienteById(id_cliente) {
    const pool = await poolPromise;

    const result = await pool.request().input("id_cliente", sql.Int, id_cliente)
      .query(`
            ${baseSelect}
            WHERE id_cliente = @id_cliente
        `);

    return result.recordset[0] || null;
  },

  // Crear cliente
  async createCliente({
    nombre,
    telefono,
    email,
    fecha_nacimiento,
    creado_por,
  }) {
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("nombre", sql.VarChar, nombre)
      .input("telefono", sql.VarChar, telefono)
      .input("email", sql.VarChar, email)
      .input("fecha_nacimiento", sql.Date, fecha_nacimiento)
      .input("creado_por", sql.Int, creado_por).query(`
            INSERT INTO cliente (nombre, telefono, email, fecha_nacimiento, creado_por)
            OUTPUT INSERTED.*
            VALUES (@nombre, @telefono, @email, @fecha_nacimiento, @creado_por)
        `);

    return result.recordset[0];
  },

  // Actualizar cliente
  async updateCliente(
    id_cliente,
    { nombre, telefono, email, fecha_nacimiento, modificado_por },
  ) {
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("id_cliente", sql.Int, id_cliente)
      .input("nombre", sql.VarChar, nombre)
      .input("telefono", sql.VarChar, telefono)
      .input("email", sql.VarChar, email)
      .input("fecha_nacimiento", sql.Date, fecha_nacimiento)
      .input("modificado_por", sql.Int, modificado_por).query(`
            UPDATE cliente
            SET nombre = @nombre,
                telefono = @telefono,
                email = @email,
                fecha_nacimiento = @fecha_nacimiento,
                modificado_por = @modificado_por,
                fecha_modificacion = GETDATE()
            WHERE id_cliente = @id_cliente
        `);

    return result.rowsAffected[0] > 0;
  },

  // Eliminar cliente
  async deleteCliente(id_cliente) {
    const pool = await poolPromise;
    try {
      const result = await pool
        .request()
        .input("id_cliente", sql.Int, id_cliente).query(`
        DELETE FROM cliente
        WHERE id_cliente = @id_cliente
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

module.exports = cliente_repository;
