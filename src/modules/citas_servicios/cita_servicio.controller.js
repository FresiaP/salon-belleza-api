const citaServicioService = require("./cita_servicio.service");
const asyncHandler = require("../../middleware/asyncHandler");
const {
  toCitaServicioDTO,
  toCitaServicioListDTO,
} = require("./cita_servicio.mapper");
const logger = require("../../utils/logger");

const cita_servicio_controller = {
  // LISTAR TODOS
  getAllCitasServicios: asyncHandler(async (req, res) => {
    logger.info("Consultando listado de citas de servicio");

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || null;
    const sort = req.query.sort || "id_cita";
    const dir = req.query.dir === "asc" ? "asc" : "desc";

    const result = await citaServicioService.getAllCitasServicios({
      page,
      limit,
      search,
      sort,
      dir,
    });

    return res.success(
      {
        ...result,
        data: toCitaServicioListDTO(result.data),
      },
      "Listado de citas de servicio",
    );
  }),

  // OBTENER POR ID
  getCitaServicioById: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const id_cita = parseInt(id);

    if (isNaN(id_cita)) {
      return res.badRequest("ID inválido");
    }

    const cita = await citaServicioService.getCitaServicioById(id_cita);

    if (!cita) {
      return res.notFound("Cita de servicio no encontrada");
    }

    return res.success(
      toCitaServicioDTO(cita),
      "Cita de servicio obtenida correctamente",
    );
  }),

  // CREAR
  createCitaServicio: asyncHandler(async (req, res) => {
    const {
      id_cliente,
      id_activo,
      id_empleado,
      fecha_cita,
      monto_final,
      notas_estilista,
    } = req.body;

    const creado = await citaServicioService.createCitaServicio({
      id_cliente,
      id_activo,
      id_empleado: id_empleado ?? null,
      fecha_cita,
      monto_final: monto_final ?? null,
      notas_estilista: notas_estilista ?? null,
      creado_por: req.user.id_usuario,
    });

    return res.created(
      toCitaServicioDTO(creado),
      "Cita de servicio creada correctamente",
    );
  }),

  // ACTUALIZAR
  updateCitaServicio: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const id_cita = parseInt(id);

    if (isNaN(id_cita)) {
      return res.badRequest("ID inválido");
    }

    const actualizado = await citaServicioService.updateCitaServicio(id_cita, {
      ...req.body,
      modificado_por: req.user.id_usuario,
    });

    if (!actualizado) {
      return res.notFound("Cita de servicio no encontrada o no actualizada");
    }

    return res.success(null, "Cita de servicio actualizada correctamente");
  }),

  // ELIMINAR
  deleteCitaServicio: asyncHandler(async (req, res) => {
    const id_cita = parseInt(req.params.id);

    if (isNaN(id_cita)) {
      return res.badRequest("ID inválido");
    }

    const eliminado = await citaServicioService.deleteCitaServicio(id_cita);

    if (!eliminado) {
      return res.notFound("Cita de servicio no encontrada o no eliminada");
    }

    return res.success(null, "Cita de servicio eliminada correctamente");
  }),
};

module.exports = cita_servicio_controller;
