const logger = require("../utils/logger");

const errorHandler = (err, req, res, next) => {

    // 🚨 Manejo específico: DNI duplicado (SQL Server)
    if (err.number === 2627 || err.number === 2601) {
        return res.status(400).json({
            success: false,
            message: "El número de DNI ya está registrado",
            data: null,
            timestamp: new Date().toISOString()
        });
    }

    const status = err.statusCode || 500;
    const message = err.message || "Error interno del servidor";

    // Log del error
    logger.error("Error detectado", {
        message: err.message,
        status: status,
        stack: err.stack,
        url: req.originalUrl,
        method: req.method,
        ip: req.ip
    });

    return res.status(status).json({
        success: false,
        message: message,
        data: null,
        timestamp: new Date().toISOString(),
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined
    });
};

module.exports = errorHandler;