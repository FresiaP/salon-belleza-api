const express = require("express");
const router = express.Router();
const empleado_controller = require("../controllers/empleado_controller");
const auth = require("../middleware/auth");

// LISTAR EMPLEADOS
router.get("/", auth("empleado_leer"), empleado_controller.getAllEmpleados);

// OBTENER EMPLEADO POR ID
router.get("/:id", auth("empleado_leer"), empleado_controller.getEmpleadoById);

// CREAR EMPLEADO
router.post("/", auth("empleado_crear"), empleado_controller.createEmpleado);

// ACTUALIZAR EMPLEADO
router.put("/:id", auth("empleado_editar"), empleado_controller.updateEmpleado);

// ELIMINAR EMPLEADO
router.delete("/:id", auth("empleado_borrar"), empleado_controller.deleteEmpleado);

module.exports = router;
