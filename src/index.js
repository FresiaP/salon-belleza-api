require("dotenv").config();

const app = require("./app");
const logger = require("./utils/logger");

const PORT = process.env.PORT || 3000;

try {

    app.listen(PORT, () => {

        logger.info(`Servidor ejecutándose en puerto ${PORT}`);

    });

} catch (error) {

    logger.error("Error al iniciar el servidor", error);
    process.exit(1);

}