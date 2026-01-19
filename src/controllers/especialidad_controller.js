const especialidad_model = require('../models/especialidad_model');

const especialidad_controller = {
    get_especialidades: async (req, res) => {
        try {
            const especialidades = await especialidad_model.get_all();
            // Enviamos un código 200 (OK) y los datos en formato JSON
            res.status(200).json(especialidades); // Envía los datos al cliente (navegador)
        } catch (error) {
            res.status(500).json({
                error: 'Error al obtener especialidades',
                message: error.message
            });
        }
    }
};

module.exports = especialidad_controller;