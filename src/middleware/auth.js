const jwt = require("jsonwebtoken");

function auth(requiredPermiso = null) {
  return (req, res, next) => {
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Token requerido",
      });
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = decoded;

      // ✅ Si no requiere permiso → pasa
      if (!requiredPermiso) {
        return next();
      }

      const permisos = decoded.permisos || [];

      // ✅ SUPER ADMIN
      if (permisos.includes("user_admin")) {
        return next();
      }

      // Permiso específico
      if (!permisos.includes(requiredPermiso)) {
        return res.status(403).json({
          success: false,
          message: "Acceso denegado",
        });
      }

      next();
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message: "Token expirado",
        });
      }

      return res.status(401).json({
        success: false,
        message: "Token inválido",
      });
    }
  };
}

module.exports = auth;
