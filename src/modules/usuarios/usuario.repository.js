const { poolPromise, sql } = require("../../config/db");

const baseSelect = `
SELECT 
    u.id_usuario,
    u.username,
    u.id_rol,
    r.nombre_rol,
    u.id_empleado,
    e.nombre_empleado,
    u.estado,
    u.creado_por,
    u.fecha_creacion,
    u.modificado_por,
    u.fecha_modificacion
FROM usuario u
LEFT JOIN rol r ON u.id_rol = r.id_rol
LEFT JOIN empleado e ON u.id_empleado = e.id_empleado
`;

const baseSelectWithPassword = `
SELECT 
    u.id_usuario,
    u.username,
    u.password_hash,
    u.id_rol,
    r.nombre_rol,
    u.id_empleado,
    e.nombre_empleado,
    u.estado,
    u.creado_por,
    u.fecha_creacion,
    u.modificado_por,
    u.fecha_modificacion
FROM usuario u
LEFT JOIN rol r ON u.id_rol = r.id_rol
LEFT JOIN empleado e ON u.id_empleado = e.id_empleado
`;

const usuario_repository = {
  // Listar usuarios
  async getUsuarios({ page = 1, limit = 10, search }) {
    const pool = await poolPromise;
    const safePage = Math.max(parseInt(page, 10) || 1, 1);
    const safeLimit = Math.max(parseInt(limit, 10) || 10, 1);
    const rowStart = (safePage - 1) * safeLimit + 1;
    const rowEnd = rowStart + safeLimit - 1;
    const request = pool.request();
    let where = "WHERE 1=1";

    if (search) {
      where += `
        AND (
          CAST(u.id_usuario AS VARCHAR(20)) LIKE @search
          OR u.username LIKE @search
          OR r.nombre_rol LIKE @search
          OR e.nombre_empleado LIKE @search
        )`;
      request.input("search", sql.VarChar, `%${search}%`);
    }

    const dataQuery = `
        SELECT *
        FROM (
          SELECT
            base_result.*,
            ROW_NUMBER() OVER (ORDER BY id_usuario DESC) AS row_num
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
        FROM usuario u
        LEFT JOIN rol r ON u.id_rol = r.id_rol
        LEFT JOIN empleado e ON u.id_empleado = e.id_empleado
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

  // Listar permisos por rol
  async getPermisosByRol(id_rol) {
    const pool = await poolPromise;

    const result = await pool.request().input("id_rol", sql.Int, id_rol).query(`
            SELECT p.nombre_permiso
            FROM rol_permiso rp
            JOIN permiso p ON rp.id_permiso = p.id_permiso
            WHERE rp.id_rol = @id_rol
        `);

    return result.recordset;
  },

  // Buscar usuario por username (para login)
  async getUsuarioByUsername(username) {
    const pool = await poolPromise;
    const result = await pool.request().input("username", sql.VarChar, username)
      .query(`
            ${baseSelectWithPassword}
           WHERE u.username = @username
            `);

    return result.recordset[0] || null;
  },

  // Buscar usuario por ID
  async getUsuarioById(id_usuario) {
    const pool = await poolPromise;

    const result = await pool.request().input("id_usuario", sql.Int, id_usuario)
      .query(`
            ${baseSelectWithPassword}
            WHERE u.id_usuario = @id_usuario
        `);

    return result.recordset[0] || null;
  },

  // Crear usuario
  async createUsuario({
    username,
    password_hash,
    id_rol,
    id_empleado,
    creado_por,
  }) {
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("username", sql.VarChar, username)
      .input("password_hash", sql.NVarChar, password_hash)
      .input("id_rol", sql.Int, id_rol)
      .input("id_empleado", sql.Int, id_empleado || null)
      .input("creado_por", sql.Int, creado_por).query(`
            INSERT INTO usuario (username, password_hash, id_rol, id_empleado, creado_por)
            VALUES (@username, @password_hash, @id_rol, @id_empleado, @creado_por)
        `);

    return result.rowsAffected[0] > 0;
  },

  // Editar usuario
  async updateUsuario(
    id_usuario,
    { username, id_rol, id_empleado, estado, modificado_por },
  ) {
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("id_usuario", sql.Int, id_usuario)
      .input("username", sql.VarChar, username)
      .input("id_rol", sql.Int, id_rol)
      .input("id_empleado", sql.Int, id_empleado)
      .input("estado", sql.Bit, estado)
      .input("modificado_por", sql.Int, modificado_por).query(`
            UPDATE usuario
            SET username = @username,
                id_rol = @id_rol,
                id_empleado = @id_empleado,
                estado = @estado,
                modificado_por = @modificado_por,
                fecha_modificacion = GETDATE()
            WHERE id_usuario = @id_usuario
        `);

    return result.rowsAffected[0] > 0;
  },

  // Cambiar contraseña
  async updatePassword(id_usuario, password_hash, modificado_por) {
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("id_usuario", sql.Int, id_usuario)
      .input("password_hash", sql.NVarChar, password_hash)
      .input("modificado_por", sql.Int, modificado_por).query(`
        UPDATE usuario
        SET password_hash = @password_hash,
            modificado_por = @modificado_por,
            fecha_modificacion = GETDATE()
        WHERE id_usuario = @id_usuario
    `);

    return result.rowsAffected[0] > 0;
  },

  // Cambiar solo el estado
  async updateEstado({ id_usuario, estado, modificado_por }) {
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("id_usuario", sql.Int, id_usuario)
      .input("estado", sql.Bit, estado)
      .input("modificado_por", sql.Int, modificado_por).query(`
            UPDATE usuario
            SET estado = @estado,
                modificado_por = @modificado_por,
                fecha_modificacion = GETDATE()
            WHERE id_usuario = @id_usuario
        `);

    return result.rowsAffected[0] > 0;
  },

  // Eliminar usuario
  async deleteUsuario(id_usuario) {
    const pool = await poolPromise;
    const result = await pool.request().input("id_usuario", sql.Int, id_usuario)
      .query(`
      DELETE FROM usuario
      WHERE id_usuario = @id_usuario
    `);
    return result.rowsAffected[0] > 0;
  },
};

module.exports = usuario_repository;
