const express = require("express");
const router = express.Router();
const controller = require("./cita_servicio.controller");
const auth = require("../../middleware/auth");
const validate = require("../../middleware/validate");

const {
  createCitaServicioSchema,
  updateCitaServicioSchema,
} = require("./cita_servicio.validation");

router.get("/", auth("cita_servicio_leer"), controller.getAllCitasServicios);

router.get("/:id", auth("cita_servicio_leer"), controller.getCitaServicioById);

router.post(
  "/",
  auth("cita_servicio_crear"),
  validate(createCitaServicioSchema),
  controller.createCitaServicio,
);

router.put(
  "/:id",
  auth("cita_servicio_editar"),
  validate(updateCitaServicioSchema),
  controller.updateCitaServicio,
);

router.delete(
  "/:id",
  auth("cita_servicio_borrar"),
  controller.deleteCitaServicio,
);

module.exports = router;
