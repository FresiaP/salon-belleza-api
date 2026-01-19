const { getConnection, sql } = require('../config/db');

const especialidad_model = {
    get_all: async () => {
        try {
            const pool = await getConnection();
            // Aquí lanzamos la pregunta a la DB
            const result = await pool.request().query('SELECT * FROM especialidad');
            return result.recordset;
        } catch (error) {
            console.error("Error en el modelo:", error.message);
            throw error;
        }
    }
};

module.exports = especialidad_model;