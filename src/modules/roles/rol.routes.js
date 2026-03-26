const express = require("express");
const router = express.Router();
const controller = require("./rol.controller");
const auth = require("../../middleware/auth");
const validate = require("../../middleware/validate");

const { createRolSchema, updateRolSchema } = require("./rol.validation");

router.get("/", auth("rol_leer"), controller.getAllRoles);

router.get("/:id", auth("rol_leer"), controller.getRolById);

router.post(
  "/",
  auth("rol_crear"),
  validate(createRolSchema),
  controller.createRol,
);

router.put(
  "/:id",
  auth("rol_editar"),
  validate(updateRolSchema),
  controller.updateRol,
);

router.delete("/:id", auth("rol_borrar"), controller.deleteRol);

module.exports = router;
