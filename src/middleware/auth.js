const jwt = require("jsonwebtoken");
const { poolPromise, sql } = require("../config/db");

function auth(requiredPermiso = null) {
    return async (req, res, next) => {
        const authHeader = req.headers["authorization"];
        if (!authHeader) {
            return res.status(401).json({ success: false, message: "Token requerido" });
        }

        const token = authHeader.split(" ")[1];
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;

            if (!requiredPermiso) {
                return next();
            }

            const pool = await poolPromise;
            const result = await pool.request()
                .input("id_rol", sql.Int, decoded.id_rol)
                .input("permiso", sql.VarChar, requiredPermiso)
                .query(`
          SELECT 1
          FROM rol_permiso rp
          JOIN permiso p ON rp.id_permiso = p.id_permiso
          WHERE rp.id_rol = @id_rol AND p.nombre_permiso = @permiso
        `);

            if (result.recordset.length === 0) {
                return res.status(403).json({ success: false, message: "Acceso denegado" });
            }

            next();
        } catch (err) {
            if (err.name === "TokenExpiredError") {
                return res.status(401).json({ success: false, message: "Token expirado" });
            }
            return res.status(401).json({ success: false, message: "Token inválido" });
        }
    };
}

module.exports = auth;
