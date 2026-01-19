const { getConnection, sql } = require('../config/db');

const marca_model = {
    // Métodos de lectura
    get_all: async () => {
        try {
            const pool = await getConnection();
            const result = await pool.request().query('SELECT * FROM marca WHERE estado_marca=1');
            return result.recordset;
        } catch (error) {
            console.error(" Error en marca_model:", error.message);
            throw error;
        }
    },

    get_by_id: async (id) => {
        try {
            const pool = await getConnection();
            const result = await pool.request()
                .input('id', sql.Int, id)
                .query('SELECT * FROM marca WHERE id_marca = @id');
            return result.recordset[0]; // Retornamos solo el primer objeto no el array completo
        } catch (error) {
            console.error("Error al obtener el Id de marca:", error.message);
            throw error;
        }
    },

    // Métodos de escritura
    create: async (nuevaMarca) => {
        try {
            const pool = await getConnection();
            const result = await pool.request()
                .input('nombre', sql.VarChar, nuevaMarca.nombre_marca)
                .input('sitio', sql.VarChar, nuevaMarca.sitio_web)
                .query(`INSERT INTO marca (nombre_marca, sitio_web, estado_marca)
                VALUES (@nombre, @sitio,1)`);
            return result;
        } catch (error) {
            console.error("Error al crear nueva marca:", error.message);
            throw error;
        }
    },

    update: async (id, datosActualizados) => {
        try {
            const pool = await getConnection();
            await pool.request()
                .input('id', sql.Int, id)
                .input('nombre', sql.VarChar, datosActualizados.nombre_marca)
                .input('sitio', sql.VarChar, datosActualizados.sitio_web)
                .input('estado', sql.Bit, datosActualizados.estado_marca)
                .query(`UPDATE marca
                SET nombre_marca = @nombre, sitio_web=@sitio, estado_marca = @estado
                WHERE id_marca = @id`);
            return true;
        } catch (error) {
            console.error("Error en marcar-model.update:", error.message);
            throw error;
        }
    },

    update_status: async (id, nuevoEstado) => {
        try {
            const pool = await getConnection();
            await pool.request()
                .input('id', sql.Int, id)
                .input('estado', sql.Bit, nuevoEstado)
                .query('UPDATE marca SET estado_marca = @estado WHERE id_marca = @id');
            return true;
        } catch (error) {
            console.error("Error en marca_model.update_status", error.message);
            throw error;
        }
    }
};
module.exports = marca_model;