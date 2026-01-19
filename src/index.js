const express = require('express');
const cors = require('cors');
const { getConnection } = require('./config/db');
require('dotenv').config();
const especialidad_routes = require('./routes/especialidad_routes'); // importamos ruta para especialidades
const marca_route = require('./routes/marca_routes');  // Importamos la ruta para marcas 

const app = express();

// Middlewares (capa de preparación)

app.use(cors());
app.use(express.json()); // Esto permite que la aplicación entienda formato JSON
//=======================================================================================================================
// Llamamos las rutas
app.use('/api/especialidades', especialidad_routes);
app.use('/api/marcas', marca_route);

//=======================================================================================================================
// Intentar conectar a la base de datos al iniciar
getConnection();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor listo en http://localhost:${PORT}`);
});