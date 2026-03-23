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
    async getUsuarios({ page = 1, limit = 10 }) {
        const pool = await poolPromise;
        const offset = (page - 1) * limit;
        const request = pool.request();
        const dataQuery = `
        ${baseSelect}
        ORDER BY u.id_usuario DESC
        OFFSET @offset ROWS
        FETCH NEXT @limit ROWS ONLY
    `;

        const countQuery = `
        SELECT COUNT(*) as total
        FROM usuario u
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
            totalPages: Math.ceil(countResult.recordset[0].total / limit)
        };
    },

    // Buscar usuario por username (para login)
    async getUsuarioByUsername(username) {
        const pool = await poolPromise;
        const result = await pool.request()
            .input("username", sql.VarChar, username)
            .query(`
            ${baseSelectWithPassword}
            WHERE u.username = @username AND u.estado = 1
            `);

        return result.recordset[0] || null;
    },

    // Buscar usuario por ID
    async getUsuarioById(id_usuario) {
        const pool = await poolPromise;

        const result = await pool.request()
            .input("id_usuario", sql.Int, id_usuario)
            .query(`
            ${baseSelect}
            WHERE u.id_usuario = @id_usuario
        `);

        return result.recordset[0] || null;
    },

    // Crear usuario
    async createUsuario({ username, password_hash, id_rol, id_empleado, creado_por }) {
        const pool = await poolPromise;

        const result = await pool.request()
            .input("username", sql.VarChar, username)
            .input("password_hash", sql.NVarChar, password_hash)
            .input("id_rol", sql.Int, id_rol)
            .input("id_empleado", sql.Int, id_empleado || null)
            .input("creado_por", sql.Int, creado_por)
            .query(`
            INSERT INTO usuario (username, password_hash, id_rol, id_empleado, creado_por)
            VALUES (@username, @password_hash, @id_rol, @id_empleado, @creado_por)
        `);

        return result.rowsAffected[0] > 0;
    },

    // Editar usuario
    async updateUsuario(id_usuario, { username, id_rol, id_empleado, estado, modificado_por }) {
        const pool = await poolPromise;

        const result = await pool.request()
            .input("id_usuario", sql.Int, id_usuario)
            .input("username", sql.VarChar, username)
            .input("id_rol", sql.Int, id_rol)
            .input("id_empleado", sql.Int, id_empleado)
            .input("estado", sql.Bit, estado)
            .input("modificado_por", sql.Int, modificado_por)
            .query(`
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

        const result = await pool.request()
            .input("id_usuario", sql.Int, id_usuario)
            .input("password_hash", sql.NVarChar, password_hash)
            .input("modificado_por", sql.Int, modificado_por)
            .query(`
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

        const result = await pool.request()
            .input("id_usuario", sql.Int, id_usuario)
            .input("estado", sql.Bit, estado)
            .input("modificado_por", sql.Int, modificado_por)
            .query(`
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
        const result = await pool.request()
            .input("id_usuario", sql.Int, id_usuario)
            .query(`
      DELETE FROM usuario
      WHERE id_usuario = @id_usuario
    `);
        return result.rowsAffected[0] > 0;
    }

};

module.exports = usuario_repository;
