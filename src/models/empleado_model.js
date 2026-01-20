const { poolPromise, sql } = require("../config/db");

const empleado_model = {
    // Listar empleados
    async getEmpleados() {
        const pool = await poolPromise;
        const result = await pool.request().query(`
      SELECT id_empleado, nombre_empleado, fecha_nacimiento, telefono, domicilio, id_especialidad
      FROM empleado
    `);
        return result.recordset;
    },

    // Obtener empleado por ID
    async getEmpleadoById(id_empleado) {
        const pool = await poolPromise;
        const result = await pool.request()
            .input("id_empleado", sql.Int, id_empleado)
            .query(`
        SELECT id_empleado, nombre_empleado, fecha_nacimiento, telefono, domicilio, id_especialidad
        FROM empleado
        WHERE id_empleado = @id_empleado
      `);
        return result.recordset[0] || null;
    },

    // Crear empleado
    async createEmpleado({ nombre_empleado, fecha_nacimiento, telefono, domicilio, id_especialidad }) {
        const pool = await poolPromise;
        const result = await pool.request()
            .input("nombre_empleado", sql.VarChar, nombre_empleado)
            .input("fecha_nacimiento", sql.Date, fecha_nacimiento)
            .input("telefono", sql.VarChar, telefono)
            .input("domicilio", sql.VarChar, domicilio)
            .input("id_especialidad", sql.Int, id_especialidad)
            .query(`
        INSERT INTO empleado (nombre_empleado, fecha_nacimiento, telefono, domicilio, id_especialidad)
        VALUES (@nombre_empleado, @fecha_nacimiento, @telefono, @domicilio, @id_especialidad)
      `);
        return result.rowsAffected[0] > 0;
    },

    // Actualizar empleado
    async updateEmpleado(id_empleado, { nombre_empleado, fecha_nacimiento, telefono, domicilio, id_especialidad }) {
        const pool = await poolPromise;
        const result = await pool.request()
            .input("id_empleado", sql.Int, id_empleado)
            .input("nombre_empleado", sql.VarChar, nombre_empleado)
            .input("fecha_nacimiento", sql.Date, fecha_nacimiento)
            .input("telefono", sql.VarChar, telefono)
            .input("domicilio", sql.VarChar, domicilio)
            .input("id_especialidad", sql.Int, id_especialidad)
            .query(`
        UPDATE empleado
        SET nombre_empleado = @nombre_empleado,
            fecha_nacimiento = @fecha_nacimiento,
            telefono = @telefono,
            domicilio = @domicilio,
            id_especialidad = @id_especialidad
        WHERE id_empleado = @id_empleado
      `);
        return result.rowsAffected[0] > 0;
    },

    // Eliminar empleado
    async deleteEmpleado(id_empleado) {
        const pool = await poolPromise;
        const result = await pool.request()
            .input("id_empleado", sql.Int, id_empleado)
            .query(`
        DELETE FROM empleado
        WHERE id_empleado = @id_empleado
      `);
        return result.rowsAffected[0] > 0;
    }
};

module.exports = empleado_model;
