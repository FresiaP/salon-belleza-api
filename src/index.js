const express = require('express');
const cors = require('cors');
const { getConnection } = require('./config/db');
require('dotenv').config();

const app = express();

// Middlewares (capa de preparación)

app.use(cors());
app.use(express.json()); // Esto permite que la aplicación entienda formato JSON

// Intentar conectar a la base de datos al iniciar
getConnection();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor listo en http://localhost:${PORT}`);
});