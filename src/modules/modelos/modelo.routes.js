const express = require("express");
const router = express.Router();
const controller = require("./modelo.controller");
const auth = require("../../middleware/auth");
const validate = require("../../middleware/validate");

const {
  createModeloSchema,
  updateModeloSchema,
  updateEstadoSchema,
} = require("./modelo.validation");

router.get("/", auth("modelo_leer"), controller.getAllModelos);

router.get("/:id", auth("modelo_leer"), controller.getModeloById);

router.post(
  "/",
  auth("modelo_crear"),
  validate(createModeloSchema),
  controller.createModelo,
);

router.put(
  "/:id",
  auth("modelo_editar"),
  validate(updateModeloSchema),
  controller.updateModelo,
);

router.patch(
  "/:id/estado",
  auth("modelo_editar"),
  validate(updateEstadoSchema),
  controller.updateEstado,
);

router.delete("/:id", auth("modelo_borrar"), controller.deleteModelo);

module.exports = router;
