const express = require("express");
const router = express.Router();
const marca_controller = require('../controllers/marca_controller');

// Definimos la ruta para marcas
router.get('/', marca_controller.get_marcas);

module.exports = router;