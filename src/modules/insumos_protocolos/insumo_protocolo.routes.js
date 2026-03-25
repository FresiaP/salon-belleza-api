const express = require("express");
const router = express.Router();
const controller = require("./insumo_protocolo.controller");
const auth = require("../../middleware/auth");
const validate = require("../../middleware/validate");

const {
  createInsumoProtocoloSchema,
  updateInsumoProtocoloSchema,
} = require("./insumo_protocolo.validation");

router.get(
  "/",
  auth("insumo_protocolo_leer"),
  controller.getAllInsumosProtocolo,
);

router.get(
  "/:id",
  auth("insumo_protocolo_leer"),
  controller.getInsumoProtocoloById,
);

router.post(
  "/",
  auth("insumo_protocolo_crear"),
  validate(createInsumoProtocoloSchema),
  controller.createInsumoProtocolo,
);

router.put(
  "/:id",
  auth("insumo_protocolo_editar"),
  validate(updateInsumoProtocoloSchema),
  controller.updateInsumoProtocolo,
);

router.delete(
  "/:id",
  auth("insumo_protocolo_borrar"),
  controller.deleteInsumoProtocolo,
);

module.exports = router;
