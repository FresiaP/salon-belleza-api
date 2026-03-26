const express = require("express");
const router = express.Router();
const controller = require("./permiso.controller");
const auth = require("../../middleware/auth");

router.get("/", auth("permiso_leer"), controller.getAllPermisos);

router.get("/:id", auth("permiso_leer"), controller.getPermisoById);

module.exports = router;
