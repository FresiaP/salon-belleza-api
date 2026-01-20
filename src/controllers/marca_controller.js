const marca_model = require("../models/marca_model");

const marca_controller = {
    get_marcas: async (req, res, next) => {
        try {
            const datos = await marca_model.get_all();
            res.json({ success: true, data: datos });
        } catch (error) {
            next(error); // delegamos al middleware de error
        }
    },

    get_marca_id: async (req, res, next) => {
        try {
            const { id } = req.params;
            const marca = await marca_model.get_by_id(parseInt(id));

            if (!marca) {
                return res.status(404).json({ success: false, message: "Marca no encontrada" });
            }

            res.json({ success: true, data: marca });
        } catch (error) {
            next(error);
        }
    },

    create_marca: async (req, res, next) => {
        try {
            const { nombre_marca, sitio_web } = req.body;
            if (!nombre_marca) {
                return res.status(400).json({ success: false, message: "El nombre es obligatorio" });
            }

            await marca_model.create({ nombre_marca, sitio_web });
            res.status(201).json({ success: true, message: "Marca creada con éxito" });
        } catch (error) {
            next(error);
        }
    },

    update_marca: async (req, res, next) => {
        try {
            const { id } = req.params;
            const datosNuevos = req.body;

            await marca_model.update(parseInt(id), datosNuevos);
            res.json({ success: true, message: "Marca actualizada correctamente" });
        } catch (error) {
            next(error);
        }
    },

    patch_status: async (req, res, next) => {
        try {
            const { id } = req.params;
            const { estado_marca } = req.body;

            if (typeof estado_marca !== "boolean") {
                return res.status(400).json({ success: false, message: "El campo estado_marca debe ser true o false" });
            }

            await marca_model.update_status(parseInt(id), estado_marca);
            res.json({ success: true, message: "Estado de la marca actualizado" });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = marca_controller;
