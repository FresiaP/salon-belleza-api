const { poolPromise, sql } = require("../../config/db");

const createError = (message, statusCode = 400) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const getRolHeader = async (executor, id_rol) => {
  const result = await executor.request().input("id_rol", sql.Int, id_rol)
    .query(`
      SELECT id_rol, nombre_rol
      FROM rol
      WHERE id_rol = @id_rol
    `);

  return result.recordset[0] || null;
};

const rol_permiso_repository = {
  async getPermisosByRol(id_rol) {
    const pool = await poolPromise;
    const rol = await getRolHeader(pool, id_rol);

    if (!rol) {
      return null;
    }

    const permisosResult = await pool.request().input("id_rol", sql.Int, id_rol)
      .query(`
        SELECT
          p.id_permiso,
          p.nombre_permiso
        FROM rol_permiso rp
        INNER JOIN permiso p ON p.id_permiso = rp.id_permiso
        WHERE rp.id_rol = @id_rol
        ORDER BY p.nombre_permiso ASC
      `);

    return {
      rol,
      permisos: permisosResult.recordset,
    };
  },

  async assignPermiso(id_rol, id_permiso) {
    const pool = await poolPromise;
    const rol = await getRolHeader(pool, id_rol);

    if (!rol) {
      return null;
    }

    const permisoResult = await pool
      .request()
      .input("id_permiso", sql.Int, id_permiso).query(`
        SELECT id_permiso, nombre_permiso
        FROM permiso
        WHERE id_permiso = @id_permiso
      `);

    const permiso = permisoResult.recordset[0];

    if (!permiso) {
      throw createError("Permiso no encontrado", 404);
    }

    try {
      await pool
        .request()
        .input("id_rol", sql.Int, id_rol)
        .input("id_permiso", sql.Int, id_permiso).query(`
          INSERT INTO rol_permiso (id_rol, id_permiso)
          VALUES (@id_rol, @id_permiso)
        `);
    } catch (error) {
      if (error.number === 2627 || error.number === 2601) {
        throw createError("El permiso ya está asignado a este rol");
      }

      if (error.number === 547) {
        throw createError("No se pudo asignar el permiso al rol");
      }

      throw error;
    }

    return { rol, permiso };
  },

  async removePermiso(id_rol, id_permiso) {
    const pool = await poolPromise;
    const rol = await getRolHeader(pool, id_rol);

    if (!rol) {
      return null;
    }

    const result = await pool
      .request()
      .input("id_rol", sql.Int, id_rol)
      .input("id_permiso", sql.Int, id_permiso).query(`
        DELETE FROM rol_permiso
        WHERE id_rol = @id_rol AND id_permiso = @id_permiso
      `);

    return result.rowsAffected[0] > 0;
  },

  async replacePermisos(id_rol, ids_permisos = []) {
    const pool = await poolPromise;
    const uniquePermisos = [...new Set(ids_permisos)];
    const transaction = new sql.Transaction(pool);
    let rolledBack = false;

    await transaction.begin();

    try {
      const rol = await getRolHeader(transaction, id_rol);

      if (!rol) {
        await transaction.rollback();
        rolledBack = true;
        return null;
      }

      if (uniquePermisos.length > 0) {
        const countRequest = transaction.request();
        const placeholders = uniquePermisos.map(
          (_, index) => `@id_permiso_${index}`,
        );

        uniquePermisos.forEach((id_permiso, index) => {
          countRequest.input(`id_permiso_${index}`, sql.Int, id_permiso);
        });

        const countResult = await countRequest.query(`
          SELECT COUNT(*) AS total
          FROM permiso
          WHERE id_permiso IN (${placeholders.join(", ")})
        `);

        if (countResult.recordset[0].total !== uniquePermisos.length) {
          throw createError("Uno o más permisos no existen", 404);
        }
      }

      await transaction.request().input("id_rol", sql.Int, id_rol).query(`
        DELETE FROM rol_permiso
        WHERE id_rol = @id_rol
      `);

      if (uniquePermisos.length > 0) {
        const insertRequest = transaction
          .request()
          .input("id_rol", sql.Int, id_rol);
        const values = uniquePermisos.map((id_permiso, index) => {
          insertRequest.input(`id_permiso_${index}`, sql.Int, id_permiso);
          return `(@id_rol, @id_permiso_${index})`;
        });

        await insertRequest.query(`
          INSERT INTO rol_permiso (id_rol, id_permiso)
          VALUES ${values.join(", ")}
        `);
      }

      await transaction.commit();

      return this.getPermisosByRol(id_rol);
    } catch (error) {
      if (!rolledBack) {
        await transaction.rollback();
      }

      throw error;
    }
  },
};

module.exports = rol_permiso_repository;
