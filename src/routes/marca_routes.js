const express = require("express");
const router = express.Router();
const marca_controller = require('../controllers/marca_controller');

// Definimos la ruta para marcas
router.get('/', marca_controller.get_marcas);
router.get('/:id', marca_controller.get_marca_id);
router.post('/', marca_controller.create_marca);


module.exports = router;