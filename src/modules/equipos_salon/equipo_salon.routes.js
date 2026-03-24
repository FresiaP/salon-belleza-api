const express = require("express");
const router = express.Router();
const controller = require("./equipo_salon.controller");
const auth = require("../../middleware/auth");
const validate = require("../../middleware/validate");

const {
  createEquipoSalonSchema,
  updateEquipoSalonSchema,
} = require("./equipo_salon.validation");

router.get("/", auth("equipo_salon_leer"), controller.getAllEquiposSalon);

router.get("/:id", auth("equipo_salon_leer"), controller.getEquipoSalonById);

router.post(
  "/",
  auth("equipo_salon_crear"),
  validate(createEquipoSalonSchema),
  controller.createEquipoSalon,
);

router.put(
  "/:id",
  auth("equipo_salon_editar"),
  validate(updateEquipoSalonSchema),
  controller.updateEquipoSalon,
);

router.delete(
  "/:id",
  auth("equipo_salon_borrar"),
  controller.deleteEquipoSalon,
);

module.exports = router;
