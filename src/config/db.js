const sql = require('mssql');
require('dotenv').config();

// Validación rápida para tu tranquilidad
if (!process.env.DB_PASSWORD) {
    console.warn("⚠️ Cuidado: Las variables del .env no se están cargando. Revisa la ubicación del archivo.");
}

const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    port: parseInt(process.env.DB_PORT) || 1433,
    options: {
        encrypt: false,
        trustServerCertificate: true
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
};

const getConnection = async () => {
    try {
        const pool = await sql.connect(dbConfig);
        console.log("✅ Conexión exitosa a SQL Server");
        return pool;
    } catch (error) {
        console.error("❌ Error de conexión detallado:");
        console.error("Mensaje:", error.message);
        console.error("Estado de la DB:", process.env.DB_DATABASE);
    }
};

module.exports = { sql, getConnection };