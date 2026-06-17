const { all, get, run, getLastInsertRowId } = require('../config/database');

const Usuario = {
    findAll: () => {
        return all('SELECT * FROM usuarios');
    },

    findById: (id) => {
        return get('SELECT * FROM usuarios WHERE id = ?', [id]);
    },

    findByEmail: (email) => {
        return get('SELECT * FROM usuarios WHERE email = ?', [email]);
    },

    create: (datos) => {
        run(`
            INSERT INTO usuarios (nombre, apellido, email, telefono, documento, rol)
            VALUES (?, ?, ?, ?, ?, ?)
        `, [
            datos.nombre,
            datos.apellido,
            datos.email,
            datos.telefono || null,
            datos.documento,
            datos.rol || 'cliente'
        ]);
        const id = getLastInsertRowId();
        return { id, ...datos };
    },

    update: (id, datos) => {
        run(`
            UPDATE usuarios
            SET nombre = ?, apellido = ?, email = ?, telefono = ?, documento = ?, rol = ?
            WHERE id = ?
        `, [
            datos.nombre,
            datos.apellido,
            datos.email,
            datos.telefono,
            datos.documento,
            datos.rol,
            id
        ]);
        return true;
    },

    delete: (id) => {
        run('DELETE FROM usuarios WHERE id = ?', [id]);
        return true;
    }
};

module.exports = Usuario;