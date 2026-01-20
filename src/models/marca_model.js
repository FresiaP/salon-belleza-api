const { poolPromise, sql } = require("../config/db");

const marca_model = {
    // Listar marcas
    async getMarcas() {
        const pool = await poolPromise;
        const result = await pool.request().query(`
      SELECT id_marca, nombre_marca, sitio_web, estado_marca
      FROM marca
    `);
        return result.recordset;
    },

    // Obtener marca por ID
    async getMarcaById(id_marca) {
        const pool = await poolPromise;
        const result = await pool.request()
            .input("id_marca", sql.Int, id_marca)
            .query(`
      SELECT id_marca, nombre_marca, sitio_web, estado_marca
      FROM marca
      WHERE id_marca = @id_marca
    `);
        return result.recordset[0] || null;
    },

    // Crear marca
    async createMarca({ nombre_marca, sitio_web, estado_marca }) {
        const pool = await poolPromise;
        const result = await pool.request()
            .input("nombre_marca", sql.VarChar, nombre_marca)
            .input("sitio_web", sql.VarChar, sitio_web)
            .input("estado_marca", sql.Bit, estado_marca)
            .query(`
        INSERT INTO marca (nombre_marca, sitio_web, estado_marca)
        VALUES (@nombre_marca, @sitio_web, @estado_marca)
      `);
        return result.rowsAffected[0] > 0;
    },

    // Actualizar marca
    async updateMarca(id_marca, { nombre_marca, sitio_web, estado_marca }) {
        const pool = await poolPromise;
        const result = await pool.request()
            .input("id_marca", sql.Int, id_marca)
            .input("nombre_marca", sql.VarChar, nombre_marca)
            .input("sitio_web", sql.VarChar, sitio_web)
            .input("estado_marca", sql.Bit, estado_marca)
            .query(`
        UPDATE marca
        SET nombre_marca = @nombre_marca,
            sitio_web = @sitio_web,
            estado_marca = @estado_marca
        WHERE id_marca = @id_marca
      `);
        return result.rowsAffected[0] > 0;
    },

    // Cambiar solo estado
    async updateEstado({ id_marca, estado_marca }) {
        const pool = await poolPromise;
        const result = await pool.request()
            .input("id_marca", sql.Int, id_marca)
            .input("estado_marca", sql.Bit, estado_marca)
            .query(`
        UPDATE marca
        SET estado_marca = @estado_marca
        WHERE id_marca = @id_marca
      `);
        return result.rowsAffected[0] > 0;
    },

    // Eliminar marca
    async deleteMarca(id_marca) {
        const pool = await poolPromise;
        const result = await pool.request()
            .input("id_marca", sql.Int, id_marca)
            .query(`
        DELETE FROM marca
        WHERE id_marca = @id_marca
      `);
        return result.rowsAffected[0] > 0;
    }
};

module.exports = marca_model;
