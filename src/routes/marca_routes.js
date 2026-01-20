const express = require("express");
const router = express.Router();
const marca_controller = require("../controllers/marca_controller");
const auth = require("../middleware/auth");

//===========================================================================
//Marcas
//===========================================================================
router.get("/", auth("ver_marca"), marca_controller.get_marcas);  // Admin y empleados pueden ver marcas 
router.get("/", auth("ver_marca"), marca_controller.get_marcas);
router.get("/:id", auth("ver_marca"), marca_controller.get_marca_id);
router.post("/", auth("crear_marca"), marca_controller.create_marca); // Solo admin puede crear marcas 
router.put("/:id", auth("editar_marca"), marca_controller.update_marca);
router.patch("/:id/status", auth("editar_marca"), marca_controller.patch_status);

module.exports = router;
