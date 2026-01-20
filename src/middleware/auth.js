const jwt = require("jsonwebtoken");
const { poolPromise, sql } = require("../config/db");

// Middleware de autorización
function auth(requiredPermiso = null) {
    return async (req, res, next) => {
        const authHeader = req.headers["authorization"];
        if (!authHeader) {
            return res.status(401).json({ message: "Token requerido" });
        }

        const token = authHeader.split(" ")[1];
        try {
            // Verificamos el token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded; // Guardamos info del usuario en la request

            // Si no se requiere permiso específico, basta con que el token sea válido
            if (!requiredPermiso) {
                return next();
            }

            // Consultamos si el rol del usuario tiene el permiso requerido
            const pool = await poolPromise;
            const result = await pool.request()
                .input("id_rol", sql.Int, decoded.id_rol)
                .input("permiso", sql.VarChar, requiredPermiso)
                .query(`
             SELECT p.nombre_permiso
             FROM rol_permiso rp
             JOIN permiso p ON rp.id_permiso = p.id_permiso
             WHERE rp.id_rol = @id_rol AND p.nombre_permiso = @permiso
             `);

            if (result.recordset.length === 0) {
                return res.status(403).json({ message: "Acceso denegado" });
            }

            next();
        } catch (err) {
            return res.status(401).json({ message: "Token inválido" });
        }
    };
}

module.exports = auth;
