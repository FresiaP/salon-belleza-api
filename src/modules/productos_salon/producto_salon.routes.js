const express = require("express");
const router = express.Router();
const controller = require("./producto_salon.controller");
const auth = require("../../middleware/auth");
const validate = require("../../middleware/validate");

const {
  createProductoSalonSchema,
  updateProductoSalonSchema,
} = require("./producto_salon.validation");

router.get("/", auth("producto_salon_leer"), controller.getAllProductosSalon);

router.get(
  "/:id",
  auth("producto_salon_leer"),
  controller.getProductoSalonById,
);

router.post(
  "/",
  auth("producto_salon_crear"),
  validate(createProductoSalonSchema),
  controller.createProductoSalon,
);

router.put(
  "/:id",
  auth("producto_salon_editar"),
  validate(updateProductoSalonSchema),
  controller.updateProductoSalon,
);

router.delete(
  "/:id",
  auth("producto_salon_borrar"),
  controller.deleteProductoSalon,
);

module.exports = router;
