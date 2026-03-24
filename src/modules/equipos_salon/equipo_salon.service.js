const repository = require("./equipo_salon.repository");

const equipo_salon_service = {
  async getAllEquiposSalon(params) {
    return repository.getEquiposSalon(params);
  },

  async getEquipoSalonById(id_equipo) {
    return repository.getEquipoSalonById(id_equipo);
  },

  async createEquipoSalon(data) {
    return repository.createEquipoSalon(data);
  },

  async updateEquipoSalon(id_equipo, data) {
    return repository.updateEquipoSalon(id_equipo, data);
  },

  async deleteEquipoSalon(id_equipo) {
    return repository.deleteEquipoSalon(id_equipo);
  },
};

module.exports = equipo_salon_service;
