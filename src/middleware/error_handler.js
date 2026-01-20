// Este es un "Interceptor" de errores
const errorHandler = (err, req, res, next) => {
    console.error('--- ERROR DETECTADO ---');
    console.error(err.stack); // Muestra dónde falló el código exactamente

    const status = err.statusCode || 500;
    const message = err.message || 'Error interno del servidor';

    res.status(status).json({
        success: false,
        status: status,
        message: message,
        // En desarrollo mostramos el error completo, en producción no.
        stack: process.env.NODE_ENV === 'development' ? err.stack : {}
    });
};

module.exports = errorHandler;