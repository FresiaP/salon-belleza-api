const repository = require("./cita_servicio.repository");

const cita_servicio_service = {
  async getAllCitasServicios(params) {
    return repository.getCitasServicios(params);
  },

  async getCitaServicioById(id_cita) {
    return repository.getCitaServicioById(id_cita);
  },

  async createCitaServicio(data) {
    return repository.createCitaServicio(data);
  },

  async updateCitaServicio(id_cita, data) {
    return repository.updateCitaServicio(id_cita, data);
  },

  async deleteCitaServicio(id_cita) {
    return repository.deleteCitaServicio(id_cita);
  },
};

module.exports = cita_servicio_service;
