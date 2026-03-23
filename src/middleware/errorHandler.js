const logger = require("../utils/logger");

const errorHandler = (err, req, res, next) => {
  // ==============================
  // ERRORES CONTROLADOS (BD)
  // ==============================

  // DNI duplicado (SQL Server)
  if (err.number === 2627 || err.number === 2601) {
    return res.badRequest("El número de DNI ya está registrado");
  }

  // FK (relaciones)
  if (err.message && err.message.includes("REFERENCE constraint")) {
    return res.badRequest(
      "No se puede eliminar el registro porque tiene datos asociados",
    );
  }

  // ==============================
  // ERROR GENERAL
  // ==============================

  const status = err.statusCode || 500;
  const message = err.message || "Error interno del servidor";

  // Log
  logger.error("Error detectado", {
    message: err.message,
    status,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
  });

  return res.error(message, status);
};

module.exports = errorHandler;
