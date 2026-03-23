const express = require("express");
const router = express.Router();
const usuario_controller = require("./usuario.controller");
const auth = require("../../middleware/auth");
const validate = require("../../middleware/validate");
const {
    createUsuarioSchema,
    updateUsuarioSchema,
    loginSchema,
    changePasswordSchema,
    updateEstadoSchema
} = require("./usuario.validation");


// LOGIN (público, no requiere permiso)
router.post("/login", validate(loginSchema), usuario_controller.login);

// LISTAR TODOS LOS USUARIOS (requiere permiso usuario_leer)
router.get("/", auth("usuario_leer"), usuario_controller.getAllUsuarios);

// CREAR USUARIO (requiere permiso usuario_crear)
router.post("/", auth("usuario_crear"), validate(createUsuarioSchema), usuario_controller.createUsuario);

// ACTUALIZAR USUARIO COMPLETO (requiere permiso usuario_editar)
router.put("/:id", auth("usuario_editar"), validate(updateUsuarioSchema), usuario_controller.updateUsuario);

// CAMBIAR PASSWORD
router.patch("/change-password", auth(), validate(changePasswordSchema), usuario_controller.changePassword
);

// ACTUALIZAR SOLO ESTADO DEL USUARIO (requiere permiso usuario_editar)
router.patch("/:id/estado", auth("usuario_editar"), validate(updateEstadoSchema), usuario_controller.updateEstado
);

// ELIMINAR USUARIO (requiere permiso usuario_borrar)
router.delete("/:id", auth("usuario_borrar"), usuario_controller.deleteUsuario);


module.exports = router;
