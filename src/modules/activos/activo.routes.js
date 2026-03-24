const express = require("express");
const router = express.Router();
const controller = require("./activo.controller");
const auth = require("../../middleware/auth");
const validate = require("../../middleware/validate");

const {
  createActivoSchema,
  updateActivoSchema,
  updateEstadoSchema,
} = require("./activo.validation");

router.get("/", auth("activo_leer"), controller.getAllActivos);

router.get("/:id", auth("activo_leer"), controller.getActivoById);

router.post(
  "/",
  auth("activo_crear"),
  validate(createActivoSchema),
  controller.createActivo,
);

router.put(
  "/:id",
  auth("activo_editar"),
  validate(updateActivoSchema),
  controller.updateActivo,
);

router.patch(
  "/:id/estado",
  auth("activo_editar"),
  validate(updateEstadoSchema),
  controller.updateEstado,
);

router.delete("/:id", auth("activo_borrar"), controller.deleteActivo);

module.exports = router;
