const { poolPromise, sql } = require("../config/db");

const usuario_model = {
    // Listar usuarios
    async getUsuarios() {
        const pool = await poolPromise;
        const result = await pool.request().query(`
      SELECT id_usuario, username, id_rol, estado
      FROM usuario
    `);
        return result.recordset;
    },

    // Buscar usuario por username (para login)
    async getUsuarioByUsername({ username }) {
        const pool = await poolPromise;
        const result = await pool.request()
            .input("username", sql.VarChar, username)
            .query(`
        SELECT * 
        FROM usuario
        WHERE username = @username AND estado = 1
      `);
        return result.recordset[0];
    },

    // Crear usuario
    async createUsuario({ username, password_hash, id_rol, id_empleado }) {
        const pool = await poolPromise;
        const result = await pool.request()
            .input("username", sql.VarChar, username)
            .input("password_hash", sql.NVarChar, password_hash)
            .input("id_rol", sql.Int, id_rol)
            .input("id_empleado", sql.Int, id_empleado)
            .query(`
        INSERT INTO usuario (username, password_hash, id_rol, id_empleado) 
        VALUES (@username, @password_hash, @id_rol, @id_empleado)
      `);
        return result.rowsAffected[0] > 0;
    },

    // Editar usuario
    async updateUsuario(id_usuario, { username, id_rol, id_empleado, estado }) {
        const pool = await poolPromise;
        const result = await pool.request()
            .input("id_usuario", sql.Int, id_usuario)
            .input("username", sql.VarChar, username)
            .input("id_rol", sql.Int, id_rol)
            .input("id_empleado", sql.Int, id_empleado)
            .input("estado", sql.Bit, estado)
            .query(`
        UPDATE usuario
        SET username = @username,
            id_rol = @id_rol,
            id_empleado = @id_empleado,
            estado = @estado
        WHERE id_usuario = @id_usuario
      `);
        return result.rowsAffected[0] > 0;
    },

    // Cambiar solo el estado
    async updateEstado({ id_usuario, estado }) {
        const pool = await poolPromise;
        const result = await pool.request()
            .input("id_usuario", sql.Int, id_usuario)
            .input("estado", sql.Bit, estado)
            .query(`
        UPDATE usuario
        SET estado = @estado
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

module.exports = usuario_model;
