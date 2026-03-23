const express = require("express");
const router = express.Router();
const controller = require("./marca.controller");
const auth = require("../../middleware/auth");
const validate = require("../../middleware/validate");

const {
    createMarcaSchema,
    updateMarcaSchema,
    updateEstadoSchema
} = require("./marca.validation");

router.get("/", auth("marca_leer"), controller.getAllMarcas);

router.get("/:id", auth("marca_leer"), controller.getMarcaById);

router.post("/", auth("marca_crear"), validate(createMarcaSchema), controller.createMarca);

router.put("/:id", auth("marca_editar"), validate(updateMarcaSchema), controller.updateMarca);

router.patch("/:id/estado", auth("marca_editar"), validate(updateEstadoSchema), controller.updateEstado);

router.delete("/:id", auth("marca_borrar"), controller.deleteMarca);

module.exports = router;