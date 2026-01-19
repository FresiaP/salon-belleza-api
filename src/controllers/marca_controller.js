const marca_model = require('../models/marca_model');

const marca_controller = {
    get_marcas: async (req, res) => {
        try {
            const datos = await marca_model.get_all();
            res.status(200).json(datos);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener las marcas' });
        }
    }
};

module.exports = marca_controller;