const logger = {

    info(message, data = null) {
        console.log(
            JSON.stringify({
                level: "INFO",
                message,
                data,
                timestamp: new Date().toISOString()
            })
        );
    },

    warn(message, data = null) {
        console.warn(
            JSON.stringify({
                level: "WARN",
                message,
                data,
                timestamp: new Date().toISOString()
            })
        );
    },

    error(message, error = null) {
        console.error(
            JSON.stringify({
                level: "ERROR",
                message,
                error: error?.message || error,
                stack: error?.stack || null,
                timestamp: new Date().toISOString()
            })
        );
    }

};

module.exports = logger;