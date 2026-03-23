const repository = require("./usuario.repository");
const bcrypt = require("bcrypt");

const usuario_service = {

    async getAllUsuarios(params) {
        return repository.getUsuarios(params);
    },

    async getUsuarioByUsername(username) {
        return repository.getUsuarioByUsername(username);
    },

    async getUsuarioById(id) {
        return repository.getUsuarioById(id);
    },

    async createUsuario(data) {

        const password_hash = await bcrypt.hash(data.password, 10);

        return repository.createUsuario({
            username: data.username,
            password_hash,
            id_rol: data.id_rol,
            id_empleado: data.id_empleado,
            creado_por: data.creado_por
        });
    },

    async updateUsuario(id, data) {
        return repository.updateUsuario(id, data);
    },
    async updatePassword(id, hash, userId) {
        return repository.updatePassword(id, hash, userId);
    },

    async updateEstado(data) {
        return repository.updateEstado(data);
    },

    async deleteUsuario(id) {
        return repository.deleteUsuario(id);
    }

};

module.exports = usuario_service;