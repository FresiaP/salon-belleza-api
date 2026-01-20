const express = require("express");
const router = express.Router();
const usuario_controller = require("../controllers/usuario_controller");
const auth = require("../middleware/auth");

// LOGIN (público, no requiere permiso)
router.post("/login", usuario_controller.login);

// LISTAR TODOS LOS USUARIOS (requiere permiso usuario_leer)
router.get("/", auth("usuario_leer"), usuario_controller.getAllUsuarios);

// CREAR USUARIO (requiere permiso usuario_crear)
router.post("/", auth("usuario_crear"), usuario_controller.createUsuario);

// ACTUALIZAR USUARIO COMPLETO (requiere permiso usuario_editar)
router.put("/:id", auth("usuario_editar"), usuario_controller.updateUsuario);

// ACTUALIZAR SOLO ESTADO DEL USUARIO (requiere permiso usuario_editar)
router.patch("/:id/estado", auth("usuario_editar"), usuario_controller.updateEstado);

// ELIMINAR USUARIO (requiere permiso usuario_borrar)
router.delete("/:id", auth("usuario_borrar"), usuario_controller.deleteUsuario);


module.exports = router;
