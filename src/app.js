const express = require("express");
const cors = require("cors");
const logger = require("./utils/logger");
const errorHandler = require("./middleware/errorHandler");

// Rutas
const empleadoRoutes = require("./modules/empleados/empleado.routes");
const usuarioRoutes = require("./modules/usuarios/usuario.routes");
const marcaRoutes = require("./modules/marcas/marca.routes");
const modeloRoutes = require("./modules/modelos/modelo.routes");
const tipoActivoRoutes = require("./modules/tipos_activos/tipo_activo.routes");
const estadoActivoRoutes = require("./modules/estados_activos/estado_activo.routes");
const activoRoutes = require("./modules/activos/activo.routes");
const equipoSalonRoutes = require("./modules/equipos_salon/equipo_salon.routes");
const incidenciaRoutes = require("./modules/incidencias/incidencia.routes");
const ventaRoutes = require("./modules/ventas/venta.routes");
const detalleVentaRoutes = require("./modules/detalles_venta/detalle_venta.routes");
const citaServicioRoutes = require("./modules/citas_servicios/cita_servicio.routes");
const especialidadRoutes = require("./modules/especialidades/especialidad.routes");
const proveedorRoutes = require("./modules/proveedores/proveedor.routes");
const clienteRoutes = require("./modules/clientes/cliente.routes");
const responseHandler = require("./middleware/responseHandler");

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
app.use("/api/modelos", modeloRoutes);
app.use("/api/tipos-activos", tipoActivoRoutes);
app.use("/api/estados-activos", estadoActivoRoutes);
app.use("/api/activos", activoRoutes);
app.use("/api/equipos-salon", equipoSalonRoutes);
app.use("/api/incidencias", incidenciaRoutes);
app.use("/api/ventas", ventaRoutes);
app.use("/api/detalles-venta", detalleVentaRoutes);
app.use("/api/citas-servicios", citaServicioRoutes);
app.use("/api/especialidades", especialidadRoutes);
app.use("/api/proveedores", proveedorRoutes);
app.use("/api/clientes", clienteRoutes);

// =============================
// RUTA NO ENCONTRADA
// =============================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Ruta no encontrada",
  });
});

// =============================
// MANEJO GLOBAL DE ERRORES
// =============================

app.use(errorHandler);

module.exports = app;
