const repository = require("./lookup.repository");

const hasPermission = (user, permission) => {
  const permisos = user?.permisos || [];

  return permisos.includes("user_admin") || permisos.includes(permission);
};

const lookup_service = {
  getAvailableLookups(user) {
    const configs = repository.getLookupConfigs();

    return Object.entries(configs)
      .filter(([, config]) => hasPermission(user, config.permission))
      .map(([resource, config]) => ({
        resource,
        label: config.label,
        permission: config.permission,
      }));
  },

  async getLookupOptions(resource, params, user) {
    const configs = repository.getLookupConfigs();
    const config = configs[resource];

    if (!config) {
      return null;
    }

    if (!hasPermission(user, config.permission)) {
      const error = new Error("Acceso denegado");
      error.statusCode = 403;
      throw error;
    }

    return repository.getLookupOptions(resource, params);
  },
};

module.exports = lookup_service;
