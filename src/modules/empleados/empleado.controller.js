const empleadoService = require("./empleado.service");
const asyncHandler = require("../../middleware/asyncHandler");
const { toEmpleadoDTO, toEmpleadoListDTO } = require("./empleado.mapper");
const logger = require("../../utils/logger");

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
        data: toEmpleadoListDTO(result.data),
      },
      "Listado de empleados",
    );
  }),

  // OBTENER POR ID
  getEmpleadoById: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const id_empleado = parseInt(id);

    if (isNaN(id_empleado)) {
      return res.badRequest("ID inválido");
    }
    const empleado = await empleadoService.getEmpleadoById(id_empleado);
    if (!empleado) {
      return res.notFound("Empleado no encontrado");
    }

    return res.success(
      toEmpleadoDTO(empleado),
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

    return res.created(toEmpleadoDTO(creado), "Empleado creado correctamente");
  }),

  // ACTUALIZAR
  updateEmpleado: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const actualizado = await empleadoService.updateEmpleado(parseInt(id), {
      ...req.body,
      modificado_por: req.user.id_usuario,
    });

    if (!actualizado) {
      return res.notFound("Empleado no encontrado o no actualizado");
    }

    return res.success(null, "Empleado actualizado correctamente");
  }),

  // ACTUALIZAR SOLO ESTADO
  updateEstado: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const id_empleado = parseInt(id);

    if (isNaN(id_empleado)) {
      return res.badRequest("ID de empleado inválido");
    }

    const { estado } = req.body;
    const modificado_por = req.user.id_usuario;

    const actualizado = await empleadoService.updateEstado({
      id_empleado,
      estado,
      modificado_por,
    });

    if (!actualizado) {
      return res.notFound("Empleado no encontrado o no actualizado");
    }

    return res.success(null, "Estado del empleado actualizado correctamente");
  }),

  // ELIMINAR
  deleteEmpleado: asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);

    const eliminado = await empleadoService.deleteEmpleado(id);

    if (!eliminado) {
      return res.notFound("Empleado no encontrado o no eliminado");
    }

    return res.success(null, "Empleado eliminado correctamente");
  }),
};

module.exports = empleado_controller;
