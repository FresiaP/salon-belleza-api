const express = require("express");
const router = express.Router();
const controller = require("./incidencia.controller");
const auth = require("../../middleware/auth");
const validate = require("../../middleware/validate");

const {
  createIncidenciaSchema,
  updateIncidenciaSchema,
} = require("./incidencia.validation");

router.get("/", auth("incidencia_leer"), controller.getAllIncidencias);

router.get("/:id", auth("incidencia_leer"), controller.getIncidenciaById);

router.post(
  "/",
  auth("incidencia_crear"),
  validate(createIncidenciaSchema),
  controller.createIncidencia,
);

router.put(
  "/:id",
  auth("incidencia_editar"),
  validate(updateIncidenciaSchema),
  controller.updateIncidencia,
);

router.delete("/:id", auth("incidencia_borrar"), controller.deleteIncidencia);

module.exports = router;
