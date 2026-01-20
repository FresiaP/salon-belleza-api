const marca_model = require("../models/marca_model");

const marca_controller = {
    // LISTAR MARCAS
    async getAllMarcas(req, res, next) {
        try {
            const datos = await marca_model.getMarcas();
            res.json({ success: true, data: datos });
        } catch (error) {
            next(error);
        }
    },

    // GET MARCA POR ID
    async getMarcaById(req, res, next) {
        try {
            const { id } = req.params;
            const id_marca = parseInt(id);

            if (isNaN(id_marca)) {
                return res.status(400).json({ success: false, message: "ID de marca inválido" });
            }

            const marca = await marca_model.getMarcaById(id_marca);
            if (!marca) {
                return res.status(404).json({ success: false, message: "Marca no encontrada" });
            }

            res.json({ success: true, data: marca });
        } catch (error) {
            next(error);
        }
    },

    // CREAR MARCA
    async createMarca(req, res, next) {
        try {
            const { nombre_marca, sitio_web, estado_marca } = req.body;
            if (!nombre_marca || estado_marca === undefined) {
                return res.status(400).json({ success: false, message: "Faltan campos obligatorios" });
            }

            const creado = await marca_model.createMarca({ nombre_marca, sitio_web, estado_marca });
            if (!creado) {
                return res.status(400).json({ success: false, message: "No se pudo crear la marca" });
            }

            res.status(201).json({ success: true, message: "Marca creada correctamente" });
        } catch (error) {
            next(error);
        }
    },

    // UPDATE MARCA
    async updateMarca(req, res, next) {
        try {
            const { id } = req.params;
            const { nombre_marca, sitio_web, estado_marca } = req.body;

            const id_marca = parseInt(id);
            if (isNaN(id_marca)) {
                return res.status(400).json({ success: false, message: "ID de marca inválido" });
            }

            const actualizado = await marca_model.updateMarca(id_marca, { nombre_marca, sitio_web, estado_marca });
            if (!actualizado) {
                return res.status(404).json({ success: false, message: "Marca no encontrada o no actualizada" });
            }

            res.json({ success: true, message: "Marca actualizada correctamente" });
        } catch (error) {
            next(error);
        }
    },

    // UPDATE ESTADO
    async updateEstado(req, res, next) {
        try {
            const { id } = req.params;
            let { estado_marca } = req.body;

            const id_marca = parseInt(id);
            if (isNaN(id_marca)) {
                return res.status(400).json({ success: false, message: "ID de marca inválido" });
            }

            if (typeof estado_marca !== "boolean") {
                if (estado_marca === 0 || estado_marca === 1) {
                    estado_marca = Boolean(estado_marca);
                } else {
                    return res.status(400).json({ success: false, message: "El estado debe ser true/false o 0/1" });
                }
            }

            const actualizado = await marca_model.updateEstado({ id_marca, estado_marca });
            if (!actualizado) {
                return res.status(404).json({ success: false, message: "Marca no encontrada o no actualizada" });
            }

            res.json({ success: true, message: "Estado de la marca actualizado" });
        } catch (error) {
            next(error);
        }
    },

    // DELETE MARCA
    async deleteMarca(req, res, next) {
        try {
            const { id } = req.params;
            const id_marca = parseInt(id);

            if (isNaN(id_marca)) {
                return res.status(400).json({ success: false, message: "ID de marca inválido" });
            }

            const eliminado = await marca_model.deleteMarca(id_marca);
            if (!eliminado) {
                return res.status(404).json({ success: false, message: "Marca no encontrada o no eliminada" });
            }

            res.json({ success: true, message: "Marca eliminada correctamente" });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = marca_controller;
