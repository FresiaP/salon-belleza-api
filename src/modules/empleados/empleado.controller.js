const empleadoService = require("./empleado.service");
const asyncHandler = require("../../middleware/async_handler");
const empleadoMapper = require("./empleado.mapper");
const logger = require("../../utils/logger");
const response = require("../../utils/response");

const empleado_controller = {
  // LISTAR TODOS
  getAllEmpleados: asyncHandler(async (req, res) => {
    logger.info("Consultando listado de empleados");

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || null;
    const estado = req.query.estado;
    const sort = req.query.sort || "id_empleado";
    const dir = req.query.dir === "asc" ? "asc" : "desc";

    const result = await empleadoService.getAllEmpleados({
      page,
      limit,
      search,
      estado,
      sort,
      dir,
    });

    return res.success(
      {
        ...result,
        data: result.data.map(empleadoMapper),
      },
      "Listado de empleados",
    );
  }),

  // OBTENER POR ID
  getEmpleadoById: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const id_empleado = parseInt(id);

    if (isNaN(id_empleado)) {
      return res.status(400).json({ success: false, message: "ID inválido" });
    }

    const empleado = await empleadoService.getEmpleadoById(id_empleado);
    if (!empleado) {
      return res
        .status(404)
        .json({ success: false, message: "Empleado no encontrado" });
    }

    return res.success(
      empleadoMapper(empleado),
      "Empleado obtenido correctamente",
    );
  }),

  // CREAR
  createEmpleado: asyncHandler(async (req, res) => {
    const {
      nombre_empleado,
      numero_dni,
      fecha_nacimiento,
      telefono,
      domicilio,
      id_especialidad,
    } = req.body;

    const creado = await empleadoService.createEmpleado({
      nombre_empleado,
      numero_dni,
      fecha_nacimiento,
      telefono,
      domicilio,
      id_especialidad,
      creado_por: req.user.id_usuario,
    });

    return response.success(res, creado, "Empleado creado correctamente", 201);
  }),

  // ACTUALIZAR
  updateEmpleado: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const actualizado = await empleadoService.updateEmpleado(parseInt(id), {
      ...req.body,
      modificado_por: req.user.id_usuario,
    });

    if (!actualizado) {
      return res.status(404).json({
        success: false,
        message: "Empleado no encontrado o no actualizado",
      });
    }

    return response.success(res, null, "Empleado actualizado correctamente");
  }),

  // ACTUALIZAR SOLO ESTADO
  updateEstado: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const id_empleado = parseInt(id);

    if (isNaN(id_empleado)) {
      return res
        .status(400)
        .json({ success: false, message: "ID de empleado inválido" });
    }

    const { estado } = req.body;
    const modificado_por = req.user.id_usuario;

    const actualizado = await empleadoService.updateEstado({
      id_empleado,
      estado,
      modificado_por,
    });

    if (!actualizado) {
      return res.status(404).json({
        success: false,
        message: "Empleado no encontrado o no actualizado",
      });
    }

    return response.success(
      res,
      null,
      "Estado del empleado actualizado correctamente",
    );
  }),

  // ELIMINAR
  deleteEmpleado: asyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
      const eliminado = await empleadoService.deleteEmpleado(parseInt(id));

      if (!eliminado) {
        return res.status(404).json({
          success: false,
          message: "Empleado no encontrado o no eliminado",
        });
      }

      return response.success(res, null, "Empleado eliminado correctamente");
    } catch (error) {
      // Captura error de FK
      if (error.message.includes("asociado")) {
        return res.status(400).json({ success: false, message: error.message });
      }
      throw error;
    }
  }),
};

module.exports = empleado_controller;
