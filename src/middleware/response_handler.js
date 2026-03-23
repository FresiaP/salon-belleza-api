const responseHandler = (req, res, next) => {

    res.success = (data = null, message = "Operación exitosa", status = 200) => {

        res.status(status).json({
            success: true,
            message,
            data,
            timestamp: new Date().toISOString()
        });

    };

    res.error = (message = "Error interno del servidor", status = 500) => {

        res.status(status).json({
            success: false,
            message,
            data: null,
            timestamp: new Date().toISOString()
        });

    };

    res.created = (data = null, message = "Recurso creado") => {

        res.status(201).json({
            success: true,
            message,
            data,
            timestamp: new Date().toISOString()
        });

    };

    res.notFound = (message = "Recurso no encontrado") => {

        res.status(404).json({
            success: false,
            message,
            data: null,
            timestamp: new Date().toISOString()
        });

    };

    res.badRequest = (message = "Solicitud inválida") => {

        res.status(400).json({
            success: false,
            message,
            data: null,
            timestamp: new Date().toISOString()
        });

    };

    next();
};

module.exports = responseHandler;