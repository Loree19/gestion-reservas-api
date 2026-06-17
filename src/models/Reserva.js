const { all, get, run, getLastInsertRowId } = require('../config/database');

const Reserva = {
    findAll: () => {
        return all(`
            SELECT r.*,
                   u.nombre || ' ' || u.apellido as usuario_nombre,
                   u.email as usuario_email,
                   s.nombre as servicio_nombre,
                   s.precio as servicio_precio
            FROM reservas r
            INNER JOIN usuarios u ON r.usuario_id = u.id
            INNER JOIN servicios s ON r.servicio_id = s.id
            ORDER BY r.fecha_reserva DESC, r.hora_inicio ASC
        `);
    },

    findById: (id) => {
        return get(`
            SELECT r.*,
                   u.nombre || ' ' || u.apellido as usuario_nombre,
                   u.email as usuario_email,
                   s.nombre as servicio_nombre,
                   s.precio as servicio_precio
            FROM reservas r
            INNER JOIN usuarios u ON r.usuario_id = u.id
            INNER JOIN servicios s ON r.servicio_id = s.id
            WHERE r.id = ?
        `, [id]);
    },

    findByUsuario: (usuarioId) => {
        return all(`
            SELECT r.*,
                   s.nombre as servicio_nombre,
                   s.precio as servicio_precio
            FROM reservas r
            INNER JOIN servicios s ON r.servicio_id = s.id
            WHERE r.usuario_id = ?
            ORDER BY r.fecha_reserva DESC
        `, [usuarioId]);
    },

    create: (datos) => {
        run(`
            INSERT INTO reservas (usuario_id, servicio_id, fecha_reserva, hora_inicio, hora_fin, estado, observaciones)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [
            datos.usuario_id,
            datos.servicio_id,
            datos.fecha_reserva,
            datos.hora_inicio,
            datos.hora_fin,
            datos.estado || 'pendiente',
            datos.observaciones || null
        ]);
        const id = getLastInsertRowId();
        return { id, ...datos };
    },

    updateEstado: (id, estado) => {
        run('UPDATE reservas SET estado = ? WHERE id = ?', [estado, id]);
        return true;
    },

    delete: (id) => {
        run('DELETE FROM reservas WHERE id = ?', [id]);
        return true;
    },

    verificarConflictoUsuario: (usuarioId, fecha, horaInicio, horaFin, excludeId = null) => {
        let sql = `
            SELECT COUNT(*) as total FROM reservas
            WHERE usuario_id = ?
            AND fecha_reserva = ?
            AND estado IN ('pendiente', 'confirmada')
            AND (hora_inicio < ? AND hora_fin > ?)
        `;
        const params = [usuarioId, fecha, horaFin, horaInicio];

        if (excludeId) {
            sql += ' AND id != ?';
            params.push(excludeId);
        }

        const result = get(sql, params);
        return result.total > 0;
    }
};

module.exports = Reserva;