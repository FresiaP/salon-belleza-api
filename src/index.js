require("dotenv").config();
const express = require("express");
const cors = require("cors");
const errorHandler = require("./middleware/error_handler");

// Importación de rutas
const especialidad_routes = require("./routes/especialidad_routes");
const marca_routes = require("./routes/marca_routes");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Endpoint de salud (útil para monitoreo)
app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date() });
});

// Rutas versionadas
app.use("/api/v1/especialidades", especialidad_routes);
app.use("/api/v1/marcas", marca_routes);

// Middleware de error (último siempre)
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`✅ Servidor listo en http://localhost:${PORT}`);
});
