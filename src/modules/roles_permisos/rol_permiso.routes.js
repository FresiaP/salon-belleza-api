const express = require("express");
const router = express.Router();
const controller = require("./rol_permiso.controller");
const auth = require("../../middleware/auth");
const validate = require("../../middleware/validate");

const {
  assignRolPermisoSchema,
  replaceRolPermisosSchema,
} = require("./rol_permiso.validation");

router.get(
  "/:id/permisos",
  auth("rol_permiso_leer"),
  controller.getPermisosByRol,
);

router.post(
  "/:id/permisos",
  auth("rol_permiso_crear"),
  validate(assignRolPermisoSchema),
  controller.assignPermiso,
);

router.put(
  "/:id/permisos",
  auth("rol_permiso_editar"),
  validate(replaceRolPermisosSchema),
  controller.replacePermisos,
);

router.delete(
  "/:id/permisos/:idPermiso",
  auth("rol_permiso_borrar"),
  controller.removePermiso,
);

module.exports = router;
