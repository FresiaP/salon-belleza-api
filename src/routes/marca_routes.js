const express = require("express");
const router = express.Router();
const marca_controller = require("../controllers/marca_controller");
const auth = require("../middleware/auth");

// LISTAR MARCAS (requiere permiso marca_leer)
router.get("/", auth("marca_leer"), marca_controller.getAllMarcas);

// OBTENER MARCA POR ID (requiere permiso marca_leer)
router.get("/:id", auth("marca_leer"), marca_controller.getMarcaById);

// CREAR MARCA (requiere permiso marca_crear)
router.post("/", auth("marca_crear"), marca_controller.createMarca);

// ACTUALIZAR MARCA COMPLETA (requiere permiso marca_editar)
router.put("/:id", auth("marca_editar"), marca_controller.updateMarca);

// ACTUALIZAR SOLO ESTADO DE MARCA (requiere permiso marca_editar)
router.patch("/:id/estado", auth("marca_editar"), marca_controller.updateEstado);

// ELIMINAR MARCA (requiere permiso marca_borrar)
router.delete("/:id", auth("marca_borrar"), marca_controller.deleteMarca);

module.exports = router;
