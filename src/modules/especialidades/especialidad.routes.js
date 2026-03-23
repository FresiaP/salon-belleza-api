const express = require("express");
const router = express.Router();
const especialidad_controller = require("./especialidad.controller");
const auth = require("../../middleware/auth");
const validate = require("../../middleware/validate");
const {
    createEspecialidadSchema,
    updateEspecialidadSchema,
    updateEstadoSchema
} = require("./especialidad.validation");

// LISTAR TODOS LAS ESPECIALIDADES (requiere permiso especialidad_leer)
router.get("/", auth("especialidad_leer"), especialidad_controller.getAllEspecialidades);

// OBTENER ESPECIALIDAD POR ID (requiere permiso especialidad_leer)
router.get("/:id", auth("especialidad_leer"), especialidad_controller.getEspecialidadById);

// CREAR ESPECIALIDAD (requiere permiso especialidad_crear)
router.post("/", auth("especialidad_crear"), validate(createEspecialidadSchema), especialidad_controller.createEspecialidad);

// ACTUALIZAR ESPECIALIDAD (requiere permiso especialidad_editar)
router.put("/:id", auth("especialidad_editar"), validate(updateEspecialidadSchema), especialidad_controller.updateEspecialidad);

// ACTUALIZAR SOLO ESTADO DE LA ESPECIALIDAD (requiere permiso especialidad_editar)
router.patch("/:id/estado", auth("especialidad_editar"), validate(updateEstadoSchema), especialidad_controller.updateEstado);

// ELIMINAR ESPECIALIDAD (requiere permiso especialidad_borrar)
router.delete("/:id", auth("especialidad_borrar"), especialidad_controller.deleteEspecialidad);

module.exports = router;
