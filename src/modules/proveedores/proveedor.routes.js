const express = require("express");
const router = express.Router();
const proveedor_controller = require("./proveedor.controller");
const auth = require("../../middleware/auth");
const validate = require("../../middleware/validate");
const {
  createProveedorSchema,
  updateProveedorSchema,
  updateEstadoSchema,
} = require("./proveedor.validation");

// LISTAR TODOS LOS PROVEEDORES (requiere permiso proveedor_leer)
router.get("/", auth("proveedor_leer"), proveedor_controller.getAllProveedores);

// OBTENER PROVEEDOR POR ID (requiere permiso proveedor_leer)
router.get(
  "/:id",
  auth("proveedor_leer"),
  proveedor_controller.getProveedorById,
);

// CREAR PROVEEDOR (requiere permiso proveedor_crear)
router.post(
  "/",
  auth("proveedor_crear"),
  validate(createProveedorSchema),
  proveedor_controller.createProveedor,
);

// ACTUALIZAR PROVEEDOR (requiere permiso proveedor_editar)
router.put(
  "/:id",
  auth("proveedor_editar"),
  validate(updateProveedorSchema),
  proveedor_controller.updateProveedor,
);

// ACTUALIZAR SOLO ESTADO DEL PROVEEDOR (requiere permiso proveedor_editar)
router.patch(
  "/:id/estado",
  auth("proveedor_editar"),
  validate(updateEstadoSchema),
  proveedor_controller.updateEstado,
);

// ELIMINAR PROVEEDOR (requiere permiso proveedor_borrar)
router.delete(
  "/:id",
  auth("proveedor_borrar"),
  proveedor_controller.deleteProveedor,
);

module.exports = router;
