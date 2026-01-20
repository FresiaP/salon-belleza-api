const sql = require("mssql");
require("dotenv").config();

// Configuración de la conexión
const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    port: parseInt(process.env.DB_PORT, 10) || 1433,
    options: {
        encrypt: false, // true si usas Azure
        trustServerCertificate: true, // útil en local/docker
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000,
    },
};

// Validación de variables de entorno críticas
["DB_USER", "DB_PASSWORD", "DB_SERVER", "DB_DATABASE"].forEach((key) => {
    if (!process.env[key]) {
        console.error(`❌ Falta la variable de entorno: ${key}`);
        process.exit(1);
    }
});

// Creamos un pool global para no abrir conexiones infinitas
const poolPromise = new sql.ConnectionPool(dbConfig)
    .connect()
    .then((pool) => {
        console.log("✅ Conectado a SQL Server (Pool creado)");
        return pool;
    })
    .catch((err) => {
        console.error("❌ Error al crear el Pool de conexión:", err);
        process.exit(1); // Si no hay DB, la app no debe arrancar
    });

// Helper opcional para simplificar consultas
async function query(sqlQuery, params = []) {
    const pool = await poolPromise;
    const request = pool.request();

    params.forEach((p) => {
        request.input(p.name, p.type, p.value);
    });

    const result = await request.query(sqlQuery);
    return result.recordset;
}

// Cierre del pool cuando la app se apaga
process.on("SIGINT", async () => {
    const pool = await poolPromise;
    await pool.close();
    console.log("🔌 Pool cerrado correctamente");
    process.exit(0);
});

module.exports = {
    sql,
    poolPromise,
    query, // exportamos el helper
};
