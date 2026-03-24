const toProveedorDTO = (prov) => {
  const dto = {
    id: prov.id_proveedor,
    razonSocial: prov.razon_social,
    contactoNombre: prov.contacto_nombre,
    telefono: prov.telefono,
    email: prov.email,
    direccion: prov.direccion,
    rucCedula: prov.ruc_cedula,
    estado: prov.estado,
  };

  // =============================
  // AUDITORÍA (opcional)
  // =============================
  if (prov.creado_por) dto.creado_por = prov.creado_por;
  if (prov.fecha_creacion) dto.fecha_creacion = prov.fecha_creacion;
  if (prov.modificado_por) dto.modificado_por = prov.modificado_por;
  if (prov.fecha_modificacion) dto.fecha_modificacion = prov.fecha_modificacion;

  return dto;
};

const toProveedorListDTO = (proveedores = []) =>
  proveedores.map(toProveedorDTO);

module.exports = {
  toProveedorDTO,
  toProveedorListDTO,
};
