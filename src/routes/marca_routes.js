const express = require("express");
const router = express.Router();
const marca_controller = require('../controllers/marca_controller');

// Definimos la ruta para marcas
router.get('/', marca_controller.get_marcas);
router.get('/:id', marca_controller.get_marca_id);
router.post('/', marca_controller.create_marca);
router.put('/:id', marca_controller.update_marca);
router.patch('/:id/status', marca_controller.patch_status);


module.exports = router;