const express = require("express");
const router = express.Router();
const controller = require("./estado_activo.controller");
const auth = require("../../middleware/auth");
const validate = require("../../middleware/validate");

const {
  createEstadoActivoSchema,
  updateEstadoActivoSchema,
} = require("./estado_activo.validation");

router.get("/", auth("estado_activo_leer"), controller.getAllEstadosActivos);

router.get("/:id", auth("estado_activo_leer"), controller.getEstadoActivoById);

router.post(
  "/",
  auth("estado_activo_crear"),
  validate(createEstadoActivoSchema),
  controller.createEstadoActivo,
);

router.put(
  "/:id",
  auth("estado_activo_editar"),
  validate(updateEstadoActivoSchema),
  controller.updateEstadoActivo,
);

router.delete(
  "/:id",
  auth("estado_activo_borrar"),
  controller.deleteEstadoActivo,
);

module.exports = router;
