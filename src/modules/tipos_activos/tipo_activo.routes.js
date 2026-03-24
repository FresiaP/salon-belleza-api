const express = require("express");
const router = express.Router();
const controller = require("./tipo_activo.controller");
const auth = require("../../middleware/auth");
const validate = require("../../middleware/validate");

const {
  createTipoActivoSchema,
  updateTipoActivoSchema,
} = require("./tipo_activo.validation");

router.get("/", auth("tipo_activo_leer"), controller.getAllTiposActivos);

router.get("/:id", auth("tipo_activo_leer"), controller.getTipoActivoById);

router.post(
  "/",
  auth("tipo_activo_crear"),
  validate(createTipoActivoSchema),
  controller.createTipoActivo,
);

router.put(
  "/:id",
  auth("tipo_activo_editar"),
  validate(updateTipoActivoSchema),
  controller.updateTipoActivo,
);

router.delete("/:id", auth("tipo_activo_borrar"), controller.deleteTipoActivo);

module.exports = router;
