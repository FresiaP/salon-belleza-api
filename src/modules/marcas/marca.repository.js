// src/models/marcas/marca.repository.js
// Maneja la base de datos
const { poolPromise, sql } = require("../../config/db");


const marca_repository = {

    async getMarcas({ page = 1, limit = 10, search, estado, sort, dir }) {
        const pool = await poolPromise;

        const offset = (page - 1) * limit;

        let where = "WHERE 1=1";
        const request = pool.request();

        // =========================================
        // WHITELIST (evita SQL Injection en sort)
        // =========================================
        const allowedSortFields = ["id_marca", "nombre_marca", "estado_marca"];
        const sortField = allowedSortFields.includes(sort) ? sort : "id_marca";
        const sortDirection = dir === "asc" ? "ASC" : "DESC";

        // =========================================

        if (search) {
            where += " AND nombre_marca LIKE @search";
            request.input("search", sql.VarChar, `%${search}%`);
        }

        if (estado !== undefined) {
            where += " AND estado_marca = @estado";
            request.input("estado", sql.Bit, estado === 'true');
        }

        const dataQuery = `
        SELECT id_marca, nombre_marca, sitio_web, estado_marca
        FROM marca
        ${where}
        ORDER BY ${sortField} ${sortDirection}
        OFFSET @offset ROWS
        FETCH NEXT @limit ROWS ONLY
    `;

        const countQuery = `
        SELECT COUNT(*) as total
        FROM marca
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
            totalPages: Math.ceil(countResult.recordset[0].total / limit)
        };
    },

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

    async createMarca({ nombre_marca, sitio_web, estado_marca }) {

        const pool = await poolPromise;
        const result = await pool.request()
            .input("nombre_marca", sql.VarChar, nombre_marca)
            .input("sitio_web", sql.VarChar, sitio_web)
            .input("estado_marca", sql.Bit, estado_marca)
            .query(`
    INSERT INTO marca (nombre_marca, sitio_web, estado_marca)
    OUTPUT INSERTED.*
    VALUES (@nombre_marca, @sitio_web, @estado_marca)
`);

        return result.recordset[0];
    },

    async updateMarca(id_marca, data) {
        const pool = await poolPromise;
        const request = pool.request().input("id_marca", sql.Int, id_marca);

        let query = "UPDATE marca SET ";
        const updates = [];

        if (data.nombre_marca !== undefined) {
            request.input("nombre_marca", sql.VarChar, data.nombre_marca);
            updates.push("nombre_marca = @nombre_marca");
        }

        if (data.sitio_web !== undefined) {
            request.input("sitio_web", sql.VarChar, data.sitio_web);
            updates.push("sitio_web = @sitio_web");
        }

        if (data.estado_marca !== undefined) {
            request.input("estado_marca", sql.Bit, data.estado_marca);
            updates.push("estado_marca = @estado_marca");
        }

        // evita ejecutar UPDATE vacío
        if (updates.length === 0) return false;

        query += updates.join(", ") + " WHERE id_marca = @id_marca";

        const result = await request.query(query);

        return result.rowsAffected[0] > 0;
    },

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

module.exports = marca_repository;