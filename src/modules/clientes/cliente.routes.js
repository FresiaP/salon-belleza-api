const express = require("express");
const router = express.Router();
const cliente_controller = require("./cliente.controller");
const auth = require("../../middleware/auth");
const validate = require("../../middleware/validate");
const {
  createClienteSchema,
  updateClienteSchema,
} = require("./cliente.validation");

// LISTAR TODOS LOS CLIENTES (requiere permiso cliente_leer)
router.get("/", auth("cliente_leer"), cliente_controller.getAllClientes);

// OBTENER CLIENTE POR ID (requiere permiso cliente_leer)
router.get("/:id", auth("cliente_leer"), cliente_controller.getClienteById);

// CREAR CLIENTE (requiere permiso cliente_crear)
router.post(
  "/",
  auth("cliente_crear"),
  validate(createClienteSchema),
  cliente_controller.createCliente,
);

// ACTUALIZAR CLIENTE (requiere permiso cliente_editar)
router.put(
  "/:id",
  auth("cliente_editar"),
  validate(updateClienteSchema),
  cliente_controller.updateCliente,
);

// ELIMINAR CLIENTE (requiere permiso cliente_borrar)
router.delete("/:id", auth("cliente_borrar"), cliente_controller.deleteCliente);

module.exports = router;
