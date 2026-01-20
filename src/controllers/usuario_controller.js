const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const usuario_model = require("../models/usuario_model");

const usuario_controller = {
    // LOGIN: validar credenciales y generar token
    async login(req, res, next) {
        const { username, password } = req.body;

        try {
            if (!username || !password) {
                return res.status(400).json({ success: false, message: "Username y password son obligatorios" });
            }

            const usuario = await usuario_model.getUsuarioByUsername({ username });
            if (!usuario) {
                return res.status(401).json({ success: false, message: "Usuario no encontrado" });
            }

            const validPassword = await bcrypt.compare(password, usuario.password_hash);
            if (!validPassword) {
                return res.status(401).json({ success: false, message: "Contraseña incorrecta" });
            }

            const token = jwt.sign(
                {
                    id_usuario: usuario.id_usuario,
                    id_rol: usuario.id_rol,
                    username: usuario.username
                },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
            );

            res.json({ success: true, message: "Login exitoso", token });
        } catch (error) {
            next(error);
        }
    },

    // LISTAR TODOS LOS USUARIOS
    async getAllUsuarios(req, res, next) {
        try {
            const datos = await usuario_model.getUsuarios();
            res.json({ success: true, data: datos });
        } catch (error) {
            next(error);
        }
    },

    // CREAR USUARIO
    async createUsuario(req, res, next) {
        const { username, password, id_rol, id_empleado } = req.body;

        try {
            if (!username || !password || !id_rol) {
                return res.status(400).json({ success: false, message: "Faltan campos obligatorios" });
            }

            const password_hash = await bcrypt.hash(password, 10);

            const creado = await usuario_model.createUsuario({
                username,
                password_hash,
                id_rol,
                id_empleado
            });

            if (!creado) {
                return res.status(400).json({ success: false, message: "No se pudo crear el usuario" });
            }

            res.status(201).json({ success: true, message: "Usuario creado correctamente" });

        } catch (error) {
            next(error);
        }
    },

    // UPDATE USUARIO
    async updateUsuario(req, res, next) {
        const { id } = req.params;
        const { username, id_rol, id_empleado, estado } = req.body;

        try {
            const id_usuario = parseInt(id);
            if (isNaN(id_usuario)) {
                return res.status(400).json({ success: false, message: "ID de usuario inválido" });
            }

            const actualizado = await usuario_model.updateUsuario(id_usuario, {
                username,
                id_rol,
                id_empleado,
                estado
            });

            if (!actualizado) {
                return res.status(404).json({ success: false, message: "Usuario no encontrado o no actualizado" });
            }

            res.json({ success: true, message: "Usuario actualizado correctamente" });
        } catch (error) {
            next(error);
        }
    },

    // UPDATE ESTADO
    async updateEstado(req, res, next) {
        try {
            const { id } = req.params;
            let { estado } = req.body;

            const id_usuario = parseInt(id);
            if (isNaN(id_usuario)) {
                return res.status(400).json({ success: false, message: "ID de usuario inválido" });
            }

            if (typeof estado !== "boolean") {
                if (estado === 0 || estado === 1) {
                    estado = Boolean(estado);
                } else {
                    return res.status(400).json({ success: false, message: "El estado debe ser true/false o 0/1" });
                }
            }

            const actualizado = await usuario_model.updateEstado({ id_usuario, estado });

            if (!actualizado) {
                return res.status(404).json({ success: false, message: "Usuario no encontrado o no actualizado" });
            }

            res.json({ success: true, message: "Estado del usuario actualizado" });
        } catch (error) {
            next(error);
        }
    },

    // DELETE USUARIO
    async deleteUsuario(req, res, next) {
        try {
            const { id } = req.params;
            const id_usuario = parseInt(id);

            if (isNaN(id_usuario)) {
                return res.status(400).json({ success: false, message: "ID de usuario inválido" });
            }

            const eliminado = await usuario_model.deleteUsuario(id_usuario);

            if (!eliminado) {
                return res.status(404).json({ success: false, message: "Usuario no encontrado o no eliminado" });
            }

            res.json({ success: true, message: "Usuario eliminado correctamente" });
        } catch (error) {
            next(error);
        }
    }

};

module.exports = usuario_controller;
