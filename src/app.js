const express = require("express");
const cors = require("cors");
const logger = require("./utils/logger");
const errorHandler = require("./middleware/error_handler");

// Rutas
const empleadoRoutes = require("./modules/empleados/empleado.routes");
const usuarioRoutes = require("./modules/usuarios/usuario.routes");
const marcaRoutes = require("./modules/marcas/marca.routes");
const especialidadRoutes = require("./modules/especialidades/especialidad.routes");
const responseHandler = require("./middleware/response_handler");

const app = express();


// =============================
// MIDDLEWARES
// =============================

app.use(cors());

app.use(express.json());

app.use(responseHandler);


// Log simple de requests
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.originalUrl}`);
    next();
});


// =============================
// RUTAS API
// =============================

app.use("/api/empleados", empleadoRoutes);
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/marcas", marcaRoutes);
app.use("/api/especialidades", especialidadRoutes);


// =============================
// RUTA NO ENCONTRADA
// =============================

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Ruta no encontrada"
    });
});


// =============================
// MANEJO GLOBAL DE ERRORES
// =============================

app.use(errorHandler);


module.exports = app;