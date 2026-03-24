const express = require("express");
const router = express.Router();
const controller = require("./venta.controller");
const auth = require("../../middleware/auth");
const validate = require("../../middleware/validate");

const { createVentaSchema, updateVentaSchema } = require("./venta.validation");

router.get("/", auth("venta_leer"), controller.getAllVentas);

router.get("/:id", auth("venta_leer"), controller.getVentaById);

router.post(
  "/",
  auth("venta_crear"),
  validate(createVentaSchema),
  controller.createVenta,
);

router.put(
  "/:id",
  auth("venta_editar"),
  validate(updateVentaSchema),
  controller.updateVenta,
);

router.delete("/:id", auth("venta_borrar"), controller.deleteVenta);

module.exports = router;
