const { getConnection } = require('../config/db');

const marca_model = {
    get_all: async () => {
        try {
            const pool = await getConnection();
            const result = await pool.request().query('SELECT * FROM marca WHERE estado_marca=1');
            return result.recordset;
        } catch (error) {
            console.error(" Error en marca_model:", error.message);
            throw error;
        }
    }
};
module.exports = marca_model;