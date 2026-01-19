const marca_model = require('../models/marca_model');

const marca_controller = {
    get_marcas: async (req, res) => {
        try {
            const datos = await marca_model.get_all();
            res.status(200).json(datos);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener las marcas' });
        }
    },

    get_marca_id: async (req, res) => {
        try {
            const { id } = req.params; // Extrae el ID de la URL 
            const marca = await marca_model.get_by_id(id);

            if (!marca) {
                return res.status(404).json({ message: 'Marca no encontrada' });
            }

            res.status(200).json(marca);
        } catch (error) {
            res.status(500).json({ error: 'Error al buscar marca' });
        }
    },

    create_marca: async (req, res) => {
        try {
            const nuevaMarca = req.body;

            if (!nuevaMarca.nombre_marca) {
                return res.status(400).json({ error: 'El nombre es obligatorio' });
            }

            await marca_model.create(nuevaMarca);
            res.status(201).json({ message: 'Marca creada con éxito' });
        } catch (error) {
            res.status(500).json({ error: 'Error al insertar en la BD' });
        }
    }
};

module.exports = marca_controller;