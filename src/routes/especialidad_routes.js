const express = require('express');
const router = express.Router();
const especialidad_controller = require('../controllers/especialidad_controller');

// Definimos que cuando alguien entre a la raíz de esta ruta, use el controlador
router.get('/', especialidad_controller.get_especialidades);

module.exports = router;