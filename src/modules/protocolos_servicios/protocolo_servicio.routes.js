const express = require("express");
const router = express.Router();
const controller = require("./protocolo_servicio.controller");
const auth = require("../../middleware/auth");
const validate = require("../../middleware/validate");

const {
  createProtocoloServicioSchema,
  updateProtocoloServicioSchema,
} = require("./protocolo_servicio.validation");

router.get(
  "/",
  auth("protocolo_servicio_leer"),
  controller.getAllProtocolosServicios,
);

router.get(
  "/:id",
  auth("protocolo_servicio_leer"),
  controller.getProtocoloServicioById,
);

router.post(
  "/",
  auth("protocolo_servicio_crear"),
  validate(createProtocoloServicioSchema),
  controller.createProtocoloServicio,
);

router.put(
  "/:id",
  auth("protocolo_servicio_editar"),
  validate(updateProtocoloServicioSchema),
  controller.updateProtocoloServicio,
);

router.delete(
  "/:id",
  auth("protocolo_servicio_borrar"),
  controller.deleteProtocoloServicio,
);

module.exports = router;
