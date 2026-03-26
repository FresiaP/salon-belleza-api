const { poolPromise, sql } = require("../../config/db");

const lookupConfigs = {
  clientes: {
    label: "Clientes",
    permission: "cliente_leer",
    valueField: "c.id_cliente",
    labelExpression: "c.nombre",
    selectFields: ["c.id_cliente AS id", "c.nombre", "c.telefono", "c.email"],
    fromClause: "FROM cliente c",
    searchFields: [
      "CAST(c.id_cliente AS VARCHAR(20))",
      "c.nombre",
      "c.telefono",
      "c.email",
    ],
    orderBy: "c.nombre ASC",
  },
  empleados: {
    label: "Empleados",
    permission: "empleado_leer",
    valueField: "e.id_empleado",
    labelExpression: "e.nombre_empleado",
    selectFields: [
      "e.id_empleado AS id",
      "e.nombre_empleado",
      "e.id_especialidad",
      "s.nombre_especialidad",
      "e.estado",
    ],
    fromClause:
      "FROM empleado e LEFT JOIN especialidad s ON e.id_especialidad = s.id_especialidad",
    searchFields: [
      "CAST(e.id_empleado AS VARCHAR(20))",
      "e.nombre_empleado",
      "s.nombre_especialidad",
    ],
    filters: {
      id_especialidad: { field: "e.id_especialidad", type: "int" },
    },
    activeCondition: "e.estado = 1",
    orderBy: "e.nombre_empleado ASC",
  },
  especialidades: {
    label: "Especialidades",
    permission: "especialidad_leer",
    valueField: "e.id_especialidad",
    labelExpression: "e.nombre_especialidad",
    selectFields: [
      "e.id_especialidad AS id",
      "e.nombre_especialidad",
      "e.estado",
    ],
    fromClause: "FROM especialidad e",
    searchFields: [
      "CAST(e.id_especialidad AS VARCHAR(20))",
      "e.nombre_especialidad",
    ],
    activeCondition: "e.estado = 1",
    orderBy: "e.nombre_especialidad ASC",
  },
  proveedores: {
    label: "Proveedores",
    permission: "proveedor_leer",
    valueField: "p.id_proveedor",
    labelExpression: "p.razon_social",
    selectFields: [
      "p.id_proveedor AS id",
      "p.razon_social",
      "p.contacto_nombre",
      "p.estado",
    ],
    fromClause: "FROM proveedor p",
    searchFields: [
      "CAST(p.id_proveedor AS VARCHAR(20))",
      "p.razon_social",
      "p.contacto_nombre",
      "p.ruc_cedula",
    ],
    activeCondition: "p.estado = 1",
    orderBy: "p.razon_social ASC",
  },
  marcas: {
    label: "Marcas",
    permission: "marca_leer",
    valueField: "m.id_marca",
    labelExpression: "m.nombre_marca",
    selectFields: ["m.id_marca AS id", "m.nombre_marca", "m.estado"],
    fromClause: "FROM marca m",
    searchFields: ["CAST(m.id_marca AS VARCHAR(20))", "m.nombre_marca"],
    activeCondition: "m.estado = 1",
    orderBy: "m.nombre_marca ASC",
  },
  modelos: {
    label: "Modelos",
    permission: "modelo_leer",
    valueField: "mo.id_modelo",
    labelExpression: "CONCAT(mo.nombre_modelo, ' - ', m.nombre_marca)",
    selectFields: [
      "mo.id_modelo AS id",
      "mo.nombre_modelo",
      "mo.id_marca",
      "m.nombre_marca",
      "mo.estado",
    ],
    fromClause: "FROM modelo mo INNER JOIN marca m ON mo.id_marca = m.id_marca",
    searchFields: [
      "CAST(mo.id_modelo AS VARCHAR(20))",
      "mo.nombre_modelo",
      "m.nombre_marca",
    ],
    filters: {
      id_marca: { field: "mo.id_marca", type: "int" },
    },
    activeCondition: "mo.estado = 1",
    orderBy: "mo.nombre_modelo ASC",
  },
  "tipos-activos": {
    label: "Tipos de activo",
    permission: "tipo_activo_leer",
    valueField: "ta.id_tipo_activo",
    labelExpression: "ta.nombre",
    selectFields: ["ta.id_tipo_activo AS id", "ta.nombre"],
    fromClause: "FROM tipo_activo ta",
    searchFields: ["CAST(ta.id_tipo_activo AS VARCHAR(20))", "ta.nombre"],
    orderBy: "ta.nombre ASC",
  },
  "estados-activos": {
    label: "Estados de activo",
    permission: "estado_activo_leer",
    valueField: "ea.id_estado_activo",
    labelExpression: "ea.nombre_estado",
    selectFields: ["ea.id_estado_activo AS id", "ea.nombre_estado"],
    fromClause: "FROM estado_activo ea",
    searchFields: [
      "CAST(ea.id_estado_activo AS VARCHAR(20))",
      "ea.nombre_estado",
    ],
    orderBy: "ea.nombre_estado ASC",
  },
  activos: {
    label: "Activos",
    permission: "activo_leer",
    valueField: "a.id_activo",
    labelExpression: "a.nombre_identificador",
    selectFields: [
      "a.id_activo AS id",
      "a.nombre_identificador",
      "a.id_tipo_activo",
      "ta.nombre AS nombre_tipo_activo",
      "a.id_proveedor",
      "p.razon_social",
      "a.id_estado_activo",
      "ea.nombre_estado",
    ],
    fromClause: `FROM activo a
      INNER JOIN tipo_activo ta ON a.id_tipo_activo = ta.id_tipo_activo
      INNER JOIN estado_activo ea ON a.id_estado_activo = ea.id_estado_activo
      LEFT JOIN proveedor p ON a.id_proveedor = p.id_proveedor`,
    searchFields: [
      "CAST(a.id_activo AS VARCHAR(20))",
      "a.nombre_identificador",
      "a.descripcion",
      "ta.nombre",
      "p.razon_social",
      "ea.nombre_estado",
    ],
    filters: {
      id_tipo_activo: { field: "a.id_tipo_activo", type: "int" },
      id_proveedor: { field: "a.id_proveedor", type: "int" },
      id_estado_activo: { field: "a.id_estado_activo", type: "int" },
    },
    orderBy: "a.nombre_identificador ASC",
  },
  ventas: {
    label: "Ventas",
    permission: "venta_leer",
    valueField: "v.id_venta",
    labelExpression:
      "CONCAT('Venta #', v.id_venta, ' - ', ISNULL(c.nombre, 'Sin cliente'))",
    selectFields: [
      "v.id_venta AS id",
      "v.id_cliente",
      "c.nombre AS nombre_cliente",
      "v.id_empleado",
      "e.nombre_empleado",
      "v.fecha_venta",
      "v.total_venta",
    ],
    fromClause: `FROM venta v
      LEFT JOIN cliente c ON v.id_cliente = c.id_cliente
      LEFT JOIN empleado e ON v.id_empleado = e.id_empleado`,
    searchFields: [
      "CAST(v.id_venta AS VARCHAR(20))",
      "c.nombre",
      "e.nombre_empleado",
    ],
    filters: {
      id_cliente: { field: "v.id_cliente", type: "int" },
      id_empleado: { field: "v.id_empleado", type: "int" },
    },
    orderBy: "v.id_venta DESC",
  },
  usuarios: {
    label: "Usuarios",
    permission: "usuario_leer",
    valueField: "u.id_usuario",
    labelExpression: "u.username",
    selectFields: [
      "u.id_usuario AS id",
      "u.username",
      "u.id_rol",
      "r.nombre_rol",
      "u.id_empleado",
      "e.nombre_empleado",
      "u.estado",
    ],
    fromClause:
      "FROM usuario u LEFT JOIN rol r ON u.id_rol = r.id_rol LEFT JOIN empleado e ON u.id_empleado = e.id_empleado",
    searchFields: [
      "CAST(u.id_usuario AS VARCHAR(20))",
      "u.username",
      "r.nombre_rol",
      "e.nombre_empleado",
    ],
    filters: {
      id_rol: { field: "u.id_rol", type: "int" },
      id_empleado: { field: "u.id_empleado", type: "int" },
    },
    activeCondition: "u.estado = 1",
    orderBy: "u.username ASC",
  },
  "citas-servicios": {
    label: "Citas de servicio",
    permission: "cita_servicio_leer",
    valueField: "cs.id_cita",
    labelExpression:
      "CONCAT('Cita #', cs.id_cita, ' - ', c.nombre, ' - ', a.nombre_identificador)",
    selectFields: [
      "cs.id_cita AS id",
      "cs.id_cliente",
      "c.nombre AS nombre_cliente",
      "cs.id_activo",
      "a.nombre_identificador AS nombre_activo",
      "cs.id_empleado",
      "e.nombre_empleado",
      "cs.fecha_cita",
      "cs.monto_final",
    ],
    fromClause:
      "FROM cita_servicio cs INNER JOIN cliente c ON cs.id_cliente = c.id_cliente INNER JOIN activo a ON cs.id_activo = a.id_activo LEFT JOIN empleado e ON cs.id_empleado = e.id_empleado",
    searchFields: [
      "CAST(cs.id_cita AS VARCHAR(20))",
      "c.nombre",
      "a.nombre_identificador",
      "e.nombre_empleado",
    ],
    filters: {
      id_cliente: { field: "cs.id_cliente", type: "int" },
      id_activo: { field: "cs.id_activo", type: "int" },
      id_empleado: { field: "cs.id_empleado", type: "int" },
    },
    orderBy: "cs.id_cita DESC",
  },
  "equipos-salon": {
    label: "Equipos de salon",
    permission: "equipo_salon_leer",
    valueField: "es.id_equipo",
    labelExpression:
      "CONCAT('Equipo #', es.id_equipo, ' - ', a.nombre_identificador)",
    selectFields: [
      "es.id_equipo AS id",
      "es.id_activo",
      "a.nombre_identificador",
      "es.id_modelo",
      "mo.nombre_modelo",
      "es.serie",
    ],
    fromClause:
      "FROM equipo_salon es INNER JOIN activo a ON es.id_activo = a.id_activo INNER JOIN modelo mo ON es.id_modelo = mo.id_modelo",
    searchFields: [
      "CAST(es.id_equipo AS VARCHAR(20))",
      "a.nombre_identificador",
      "mo.nombre_modelo",
      "es.serie",
    ],
    filters: {
      id_activo: { field: "es.id_activo", type: "int" },
      id_modelo: { field: "es.id_modelo", type: "int" },
    },
    orderBy: "es.id_equipo DESC",
  },
  "productos-salon": {
    label: "Productos de salon",
    permission: "producto_salon_leer",
    valueField: "ps.id_producto",
    labelExpression:
      "CONCAT(a.nombre_identificador, ' - ', ISNULL(m.nombre_marca, 'Sin marca'))",
    selectFields: [
      "ps.id_producto AS id",
      "ps.id_activo",
      "a.nombre_identificador",
      "ps.id_marca",
      "m.nombre_marca",
      "ps.codi_barras",
      "ps.stock_actual",
    ],
    fromClause:
      "FROM producto_salon ps INNER JOIN activo a ON ps.id_activo = a.id_activo INNER JOIN marca m ON ps.id_marca = m.id_marca",
    searchFields: [
      "CAST(ps.id_producto AS VARCHAR(20))",
      "a.nombre_identificador",
      "m.nombre_marca",
      "ps.codi_barras",
    ],
    filters: {
      id_activo: { field: "ps.id_activo", type: "int" },
      id_marca: { field: "ps.id_marca", type: "int" },
    },
    orderBy: "a.nombre_identificador ASC",
  },
  "insumos-protocolos": {
    label: "Insumos de protocolo",
    permission: "insumo_protocolo_leer",
    valueField: "ip.id_insumo",
    labelExpression:
      "CONCAT('Insumo #', ip.id_insumo, ' - ', apr.nombre_identificador)",
    selectFields: [
      "ip.id_insumo AS id",
      "ip.id_protocolo",
      "ap.nombre_identificador AS nombre_activo_protocolo",
      "ip.id_activo_producto",
      "apr.nombre_identificador AS nombre_activo_producto",
      "ip.cantidad_sugerida",
    ],
    fromClause:
      "FROM insumo_protocolo ip INNER JOIN protocolo_servicio ps ON ip.id_protocolo = ps.id_protocolo INNER JOIN activo ap ON ps.id_activo = ap.id_activo INNER JOIN activo apr ON ip.id_activo_producto = apr.id_activo",
    searchFields: [
      "CAST(ip.id_insumo AS VARCHAR(20))",
      "CAST(ip.id_protocolo AS VARCHAR(20))",
      "ap.nombre_identificador",
      "apr.nombre_identificador",
      "ip.cantidad_sugerida",
    ],
    filters: {
      id_protocolo: { field: "ip.id_protocolo", type: "int" },
      id_activo_producto: { field: "ip.id_activo_producto", type: "int" },
    },
    orderBy: "ip.id_insumo DESC",
  },
  roles: {
    label: "Roles",
    permission: "rol_leer",
    valueField: "r.id_rol",
    labelExpression: "r.nombre_rol",
    selectFields: ["r.id_rol AS id", "r.nombre_rol"],
    fromClause: "FROM rol r",
    searchFields: ["CAST(r.id_rol AS VARCHAR(20))", "r.nombre_rol"],
    orderBy: "r.nombre_rol ASC",
  },
  permisos: {
    label: "Permisos",
    permission: "permiso_leer",
    valueField: "p.id_permiso",
    labelExpression: "p.nombre_permiso",
    selectFields: ["p.id_permiso AS id", "p.nombre_permiso"],
    fromClause: "FROM permiso p",
    searchFields: ["CAST(p.id_permiso AS VARCHAR(20))", "p.nombre_permiso"],
    orderBy: "p.nombre_permiso ASC",
  },
  "protocolos-servicios": {
    label: "Protocolos de servicio",
    permission: "protocolo_servicio_leer",
    valueField: "ps.id_protocolo",
    labelExpression:
      "CONCAT('Protocolo #', ps.id_protocolo, ' - ', a.nombre_identificador)",
    selectFields: [
      "ps.id_protocolo AS id",
      "ps.id_activo",
      "a.nombre_identificador",
      "ps.tiempo_estimado_min",
    ],
    fromClause:
      "FROM protocolo_servicio ps INNER JOIN activo a ON ps.id_activo = a.id_activo",
    searchFields: [
      "CAST(ps.id_protocolo AS VARCHAR(20))",
      "a.nombre_identificador",
      "ps.paso_a_paso",
      "ps.precauciones",
    ],
    filters: {
      id_activo: { field: "ps.id_activo", type: "int" },
    },
    orderBy: "ps.id_protocolo DESC",
  },
};

const applyFilterInput = (request, key, type, rawValue) => {
  if (type === "int") {
    const parsed = parseInt(rawValue, 10);

    if (Number.isNaN(parsed)) {
      throw new Error(`Filtro inválido: ${key}`);
    }

    request.input(key, sql.Int, parsed);
    return;
  }

  request.input(key, sql.VarChar, rawValue);
};

const buildSearchClause = (searchFields = []) => {
  if (searchFields.length === 0) {
    return "";
  }

  return ` AND (${searchFields.map((field) => `${field} LIKE @search`).join(" OR ")})`;
};

const lookup_repository = {
  getLookupConfigs() {
    return lookupConfigs;
  },

  async getLookupOptions(
    resource,
    { search, limit = 20, includeInactive, filters = {} },
  ) {
    const config = lookupConfigs[resource];

    if (!config) {
      return null;
    }

    const pool = await poolPromise;
    const request = pool.request();
    let where = "WHERE 1=1";

    request.input("limit", sql.Int, limit);

    if (config.activeCondition && !includeInactive) {
      where += ` AND ${config.activeCondition}`;
    }

    if (search) {
      where += buildSearchClause(config.searchFields);
      request.input("search", sql.NVarChar, `%${search}%`);
    }

    if (config.filters) {
      for (const [filterKey, filterConfig] of Object.entries(config.filters)) {
        const filterValue = filters[filterKey];

        if (
          filterValue === undefined ||
          filterValue === null ||
          filterValue === ""
        ) {
          continue;
        }

        where += ` AND ${filterConfig.field} = @${filterKey}`;
        applyFilterInput(request, filterKey, filterConfig.type, filterValue);
      }
    }

    const query = `
      SELECT TOP (@limit)
        ${config.valueField} AS value,
        ${config.labelExpression} AS label,
        ${config.selectFields.join(",\n        ")}
      ${config.fromClause}
      ${where}
      ORDER BY ${config.orderBy}
    `;

    const result = await request.query(query);

    return {
      resource,
      label: config.label,
      permission: config.permission,
      items: result.recordset,
    };
  },
};

module.exports = lookup_repository;
