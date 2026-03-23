const { poolPromise, sql } = require("../../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const usuario_service = require("./usuario.service");
const { toUsuarioDTO, toUsuarioListDTO } = require("./usuario.mapper");
const asyncHandler = require("../../middleware/async_handler");

const usuario_controller = {
  // =============================
  // LOGIN
  // =============================
  login: asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.badRequest("Username y password son obligatorios");
    }

    const usuario = await usuario_service.getUsuarioByUsername(username);

    if (!usuario) {
      return res.status(401).json({
        success: false,
        message: "Usuario o contraseña incorrectos",
      });
    }

    if (!usuario.estado) {
      return res.status(403).json({
        success: false,
        message: "Usuario inactivo",
      });
    }

    const validPassword = await bcrypt.compare(password, usuario.password_hash);

    if (!validPassword) {
      return res.status(401).json({
        success: false,
        message: "Usuario o contraseña incorrectos",
      });
    }

    const pool = await poolPromise;
    const permisosResult = await pool
      .request()
      .input("id_rol", sql.Int, usuario.id_rol).query(`
                SELECT p.nombre_permiso
                FROM rol_permiso rp
                JOIN permiso p ON rp.id_permiso = p.id_permiso
                WHERE rp.id_rol = @id_rol
            `);

    const permisos = permisosResult.recordset.map((p) => p.nombre_permiso);

    const token = jwt.sign(
      {
        id_usuario: usuario.id_usuario,
        username: usuario.username,
        id_rol: usuario.id_rol,
        permisos,
      },
      process.env.JWT_SECRET,
      { expiresIn: "8h" },
    );

    return res.success(
      {
        user: toUsuarioDTO(usuario),
        permisos,
        token,
      },
      "Login exitoso",
    );
  }),

  // =============================
  // LISTAR USUARIOS
  // =============================
  getAllUsuarios: asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const datos = await usuario_service.getAllUsuarios({ page, limit });

    return res.success(
      {
        ...datos,
        data: datos.data.map((usuario) => toUsuarioListDTO(usuario)),
      },
      "Listado de usuarios",
    );
  }),

  // =============================
  // CREAR USUARIO
  // =============================
  createUsuario: asyncHandler(async (req, res) => {
    const { username, password, id_rol, id_empleado } = req.body;

    if (!username || !password || !id_rol) {
      return res.badRequest("Faltan campos obligatorios");
    }

    const creado = await usuario_service.createUsuario({
      username,
      password,
      id_rol,
      id_empleado,
      creado_por: req.user.id_usuario,
    });

    if (!creado) {
      return res.badRequest("No se pudo crear el usuario");
    }

    return res.created(null, "Usuario creado correctamente");
  }),

  // =============================
  // ACTUALIZAR USUARIO
  // =============================
  updateUsuario: asyncHandler(async (req, res) => {
    const id_usuario = parseInt(req.params.id);

    if (isNaN(id_usuario)) {
      return res.badRequest("ID de usuario inválido");
    }

    const actualizado = await usuario_service.updateUsuario(id_usuario, {
      ...req.body,
      modificado_por: req.user.id_usuario,
    });

    if (!actualizado) {
      return res.notFound("Usuario no encontrado o no actualizado");
    }

    return res.success(null, "Usuario actualizado correctamente");
  }),

  // =============================
  // CAMBIAR PASSWORD
  // =============================
  changePassword: asyncHandler(async (req, res) => {
    const id_usuario = req.user.id_usuario;
    const { password_actual, password_nuevo } = req.body;

    const usuario = await usuario_service.getUsuarioById(id_usuario);

    if (!usuario) {
      return res.notFound("Usuario no encontrado");
    }

    const valid = await bcrypt.compare(password_actual, usuario.password_hash);

    if (!valid) {
      return res.badRequest("Password actual incorrecto");
    }

    const newHash = await bcrypt.hash(password_nuevo, 10);

    await usuario_service.updatePassword(
      id_usuario,
      newHash,
      req.user.id_usuario,
    );

    return res.success(null, "Password actualizado correctamente");
  }),

  // =============================
  // ACTUALIZAR ESTADO
  // =============================
  updateEstado: asyncHandler(async (req, res) => {
    const id_usuario = parseInt(req.params.id);

    if (isNaN(id_usuario)) {
      return res.badRequest("ID de usuario inválido");
    }

    let { estado } = req.body;

    if (typeof estado !== "boolean") {
      if (estado === 0 || estado === 1) {
        estado = Boolean(estado);
      } else {
        return res.badRequest("El estado debe ser true/false o 0/1");
      }
    }

    const actualizado = await usuario_service.updateEstado({
      id_usuario,
      estado,
      modificado_por: req.user.id_usuario,
    });

    if (!actualizado) {
      return res.notFound("Usuario no encontrado o no actualizado");
    }

    return res.success(null, "Estado del usuario actualizado");
  }),

  // =============================
  // ELIMINAR USUARIO
  // =============================
  deleteUsuario: asyncHandler(async (req, res) => {
    const id_usuario = parseInt(req.params.id);

    if (isNaN(id_usuario)) {
      return res.badRequest("ID de usuario inválido");
    }

    const eliminado = await usuario_service.deleteUsuario(id_usuario);

    if (!eliminado) {
      return res.notFound("Usuario no encontrado o no eliminado");
    }

    return res.success(null, "Usuario eliminado correctamente");
  }),
};

module.exports = usuario_controller;
