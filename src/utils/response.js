// ===============================
// Respuestas estándar para la API
// ===============================

const success = (res, data = null, message = "Operación exitosa", status = 200) => {

    return res.status(status).json({
        success: true,
        message,
        data,
        timestamp: new Date().toISOString()
    });

};


const error = (res, message = "Error interno del servidor", status = 500) => {

    return res.status(status).json({
        success: false,
        message,
        data: null,
        timestamp: new Date().toISOString()
    });

};


const created = (res, data = null, message = "Recurso creado") => {

    return res.status(201).json({
        success: true,
        message,
        data,
        timestamp: new Date().toISOString()
    });

};


const notFound = (res, message = "Recurso no encontrado") => {

    return res.status(404).json({
        success: false,
        message,
        data: null,
        timestamp: new Date().toISOString()
    });

};


const badRequest = (res, message = "Solicitud inválida") => {

    return res.status(400).json({
        success: false,
        message,
        data: null,
        timestamp: new Date().toISOString()
    });

};


module.exports = {
    success,
    error,
    created,
    notFound,
    badRequest
};