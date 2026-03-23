// ===============================
// Helpers reutilizables
// ===============================

// Parsear ID seguro
const parseId = (id) => {

    const parsed = parseInt(id, 10);

    if (isNaN(parsed) || parsed <= 0) {
        return null;
    }

    return parsed;
};


// Validar string no vacío
const isValidString = (value) => {

    if (!value) return false;

    if (typeof value !== "string") return false;

    if (value.trim().length === 0) return false;

    return true;
};


// Validar email básico
const isValidEmail = (email) => {

    if (!email) return false;

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return regex.test(email);
};


// Sanitizar texto
const sanitizeString = (value) => {

    if (!value) return null;

    return value.trim();
};


// Validar booleano
const parseBoolean = (value) => {

    if (value === true || value === "true" || value === 1 || value === "1") {
        return true;
    }

    if (value === false || value === "false" || value === 0 || value === "0") {
        return false;
    }

    return null;

};


// Validar números
const parseNumber = (value) => {

    const number = Number(value);

    if (isNaN(number)) {
        return null;
    }

    return number;
};


// Validar paginación
const getPagination = (query) => {

    let page = parseInt(query.page) || 1;

    let limit = parseInt(query.limit) || 10;

    if (page < 1) page = 1;

    if (limit < 1) limit = 10;

    if (limit > 100) limit = 100;

    const offset = (page - 1) * limit;

    return {
        page,
        limit,
        offset
    };
};




// ===============================
// Exportaciones
// ===============================

module.exports = {
    parseId,
    isValidString,
    isValidEmail,
    sanitizeString,
    parseBoolean,
    parseNumber,
    getPagination,
};