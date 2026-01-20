const { poolPromise, sql } = require("../config/db");

const marca_model = {
    get_all: async () => {
        const pool = await poolPromise;
        const result = await pool.request().query("SELECT * FROM marca WHERE estado_marca = 1");
        return result.recordset;
    },

    get_by_id: async (id_marca) => {
        const pool = await poolPromise;
        const result = await pool.request()
            .input("id_marca", sql.Int, id_marca)
            .query("SELECT * FROM marca WHERE id_marca = @id_marca");
        return result.recordset[0];
    },

    create: async (nuevaMarca) => {
        const pool = await poolPromise;
        const result = await pool.request()
            .input("nombre_marca", sql.VarChar, nuevaMarca.nombre_marca)
            .input("sitio_web", sql.VarChar, nuevaMarca.sitio_web)
            .query("INSERT INTO marca (nombre_marca, sitio_web, estado_marca) VALUES (@nombre_marca, @sitio_web, 1)");
        return result.rowsAffected; // devolvemos cuántas filas se insertaron
    },

    update: async (id_marca, datos) => {
        const pool = await poolPromise;
        const result = await pool.request()
            .input("id_marca", sql.Int, id_marca)
            .input("nombre_marca", sql.VarChar, datos.nombre_marca)
            .input("sitio_web", sql.VarChar, datos.sitio_web)
            .input("estado_marca", sql.Bit, datos.estado_marca)
            .query("UPDATE marca SET nombre_marca=@nombre_marca, sitio_web=@sitio_web, estado_marca=@estado_marca WHERE id_marca=@id_marca");
        return result.rowsAffected;
    },

    update_status: async (id_marca, nuevoEstado) => {
        const pool = await poolPromise;
        const result = await pool.request()
            .input("id_marca", sql.Int, id_marca)
            .input("estado_marca", sql.Bit, nuevoEstado)
            .query("UPDATE marca SET estado_marca=@estado_marca WHERE id_marca=@id_marca");
        return result.rowsAffected;
    }
};

module.exports = marca_model;
