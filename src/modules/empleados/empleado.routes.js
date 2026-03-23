const express = require("express");
const router = express.Router();
const empleado_controller = require("./empleado.controller");
const auth = require("../../middleware/auth");
const validate = require("../../middleware/validate");
const {
    createEmpleadoSchema,
    updateEmpleadoSchema,
    updateEstadoSchema
} = require("./empleado.validation");

// LISTAR TODOS LOS EMPLEADOS (requiere permiso empleado_leer)
router.get("/", auth("empleado_leer"), empleado_controller.getAllEmpleados);

// OBTENER EMPLEADO POR ID (requiere permiso empleado_leer)
router.get("/:id", auth("empleado_leer"), empleado_controller.getEmpleadoById);

// CREAR EMPLEADO (requiere permiso empleado_crear)
router.post("/", auth("empleado_crear"), validate(createEmpleadoSchema), empleado_controller.createEmpleado);

// ACTUALIZAR EMPLEADO COMPLETO (requiere permiso empleado_editar)
router.put("/:id", auth("empleado_editar"), validate(updateEmpleadoSchema), empleado_controller.updateEmpleado);

// ACTUALIZAR SOLO ESTADO DEL EMPLEADO (requiere permiso empleado_editar)
router.patch("/:id/estado", auth("empleado_editar"), validate(updateEstadoSchema), empleado_controller.updateEstado);

// ELIMINAR EMPLEADO (requiere permiso empleado_borrar)
router.delete("/:id", auth("empleado_borrar"), empleado_controller.deleteEmpleado);

module.exports = router;
