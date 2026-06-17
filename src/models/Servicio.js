const { all, get, run, getLastInsertRowId } = require('../config/database');

const Servicio = {
    findAll: (activo) => {
        if (activo !== undefined) {
            return all('SELECT * FROM servicios WHERE activo = ?', [activo]);
        }
        return all('SELECT * FROM servicios');
    },

    findById: (id) => {
        return get('SELECT * FROM servicios WHERE id = ?', [id]);
    },

    create: (datos) => {
        run(`
            INSERT INTO servicios (nombre, descripcion, duracion_minutos, precio, capacidad)
            VALUES (?, ?, ?, ?, ?)
        `, [
            datos.nombre,
            datos.descripcion || null,
            datos.duracion_minutos,
            datos.precio,
            datos.capacidad || 1
        ]);
        const id = getLastInsertRowId();
        return { id, ...datos };
    },

    update: (id, datos) => {
        run(`
            UPDATE servicios
            SET nombre = ?, descripcion = ?, duracion_minutos = ?, precio = ?, capacidad = ?, activo = ?
            WHERE id = ?
        `, [
            datos.nombre,
            datos.descripcion,
            datos.duracion_minutos,
            datos.precio,
            datos.capacidad,
            datos.activo,
            id
        ]);
        return true;
    },

    delete: (id) => {
        run('DELETE FROM servicios WHERE id = ?', [id]);
        return true;
    },

    verificarDisponibilidad: (servicioId, fecha, horaInicio, horaFin) => {
        const result = get(`
            SELECT COUNT(*) as total FROM reservas
            WHERE servicio_id = ?
            AND fecha_reserva = ?
            AND estado IN ('pendiente', 'confirmada')
            AND (
                (hora_inicio <= ? AND hora_fin > ?) OR
                (hora_inicio < ? AND hora_fin >= ?)
            )
        `, [servicioId, fecha, horaFin, horaInicio, horaFin, horaInicio]);
        
        const servicio = Servicio.findById(servicioId);
        return result.total < (servicio ? servicio.capacidad : 0);
    }
};

module.exports = Servicio;