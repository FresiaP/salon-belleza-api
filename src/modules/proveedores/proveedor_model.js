const { poolPromise, sql } = require("../../config/db");

const proveedor_model = {
    // LISTAR PROVEEDORES
    async getProveedores() {
        const pool = await poolPromise;
        const result = await pool.request().query(`
         SELECT id_proveedor, nombre_empresa, contacto_nombre, telefono, email, direccion,ruc_cedula, estado_proveedor
         FROM proveedor
         ORDER BY nombre_empresa ASC  
        `);
        return result.recordset;
    },
    // OBTENER PROVEEDOR POR ID
    async getProveedorById(id_proveedor) {
        const pool = await poolPromise;
        const result = await pool.request()
            .input("id_proveedor", sql.Int, id_proveedor)
            .query(`
        SELECT id_proveedor, nombre_empresa, contacto_nombre, telefono, email, direccion,ruc_cedula, estado_proveedor
        FROM proveedor
        WHERE id_proveedor = @id_proveedor
        `);
        return result.recordset[0] || null;
    },
    // CREAR PROVEEDOR
    async createProveedor(nombre_empresa, contacto_nombre, telefono, email, direccion, ruc_cedula) {
        const pool = await poolPromise;
        const result = await pool.request()
            .input("nombre_empresa", sql.VarChar, nombre_empresa)
            .input("contacto_nombre", sql.VarChar, contacto_nombre)
            .input("telefono", sql.VarChar, telefono)
            .input("email", sql.VarChar, email)
            .input("direccion", sql.VarChar, direccion)
            .input("ruc_cedula", sql.VarChar, ruc_cedula)
            .query(`
         INSERT INTO proveedor (nombre_empresa, contacto_nombre, telefono, email, direccion,ruc_cedula)
         VALUES (@nombre_empresa, @contacto_nombre, @telefono, @email, @direccion, @ruc_cedula)
        `);
        return result.rowsAffected[0] > 0;
    },
    // EDITAR PROVEEDOR
    async updateProveedor(id_proveedor, { nombre_empresa, contacto_nombre, telefono, email, direccion, ruc_cedula }) {
        const pool = await poolPromise;
        const result = await pool.request()
            .input("id_proveedor", sql.Int, id_proveedor)
            .input("nombre_empresa", sql.VarChar, nombre_empresa)
            .input("contacto_nombre", sql.VarChar, contacto_nombre)
            .input("telefono", sql.VarChar, telefono)
            .input("email", sql.VarChar, email)
            .input("direccion", sql.VarChar, direccion)
            .input("ruc_cedula", sql.VarChar, ruc_cedula)
            .query(`
         UPDATE proveedor
         SET nombre_empresa=@nombre_empresa, 
             contacto_nombre=@contacto_nombre, 
             telefono=@telefono, 
             email=@email, 
             direccion=@direccion, 
             ruc_cedula=@ruc_cedula
         WHERE id_proveedor = @id_proveedor
        `);
        return result.rowsAffected[0] > 0;
    },

    // EDITAR ESTADO PROVEEDOR
    async updateEstadoProveedor(id_proveedor, { estado_proveedor }) {
        const pool = await poolPromise;
        const result = await pool.request()
            .input("id_proveedor", sql.Int, id_proveedor)
            .input("estado_proveedor", sql.Bit, estado_proveedor)
            .query(`
         UPDATE proveedor
         SET estado_proveedor=@estado_proveedor
         WHERE id_proveedor = @id_proveedor
        `);
        return result.rowsAffected[0] > 0;
    },

    // ELIMINAR PROVEEDOR
    async deleteProveedor(id_proveedor) {
        const pool = await poolPromise;
        const result = await pool.request()
            .input("id_proveedor", sql.Int, id_proveedor)
            .query(`
                DELETE FROM proveedor
                WHERE id_proveedor = @id_proveedor
            `)
        return result.rowsAffected[0] > 0;
    }

};

module.exports = proveedor_model;