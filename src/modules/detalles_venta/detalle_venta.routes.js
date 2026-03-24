const express = require("express");
const router = express.Router();
const controller = require("./detalle_venta.controller");
const auth = require("../../middleware/auth");
const validate = require("../../middleware/validate");

const {
  createDetalleVentaSchema,
  updateDetalleVentaSchema,
} = require("./detalle_venta.validation");

router.get("/", auth("detalle_venta_leer"), controller.getAllDetallesVenta);

router.get("/:id", auth("detalle_venta_leer"), controller.getDetalleVentaById);

router.post(
  "/",
  auth("detalle_venta_crear"),
  validate(createDetalleVentaSchema),
  controller.createDetalleVenta,
);

router.put(
  "/:id",
  auth("detalle_venta_editar"),
  validate(updateDetalleVentaSchema),
  controller.updateDetalleVenta,
);

router.delete(
  "/:id",
  auth("detalle_venta_borrar"),
  controller.deleteDetalleVenta,
);

module.exports = router;
