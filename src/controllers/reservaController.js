const Reserva = require('../models/Reserva');
const Servicio = require('../models/Servicio');
const Usuario = require('../models/Usuario');
const { validationResult } = require('express-validator');

const reservaController = {
    obtenerTodas: (req, res) => {
        try {
            const reservas = Reserva.findAll();
            res.json({ success: true, total: reservas.length, data: reservas });
        } catch (error) {
            res.status(500).json({ success: false, mensaje: 'Error al obtener reservas', error: error.message });
        }
    },

    obtenerPorId: (req, res) => {
        try {
            const reserva = Reserva.findById(req.params.id);
            if (!reserva) {
                return res.status(404).json({ success: false, mensaje: 'Reserva no encontrada' });
            }
            res.json({ success: true, data: reserva });
        } catch (error) {
            res.status(500).json({ success: false, mensaje: 'Error al obtener reserva', error: error.message });
        }
    },

    obtenerPorUsuario: (req, res) => {
        try {
            const reservas = Reserva.findByUsuario(req.params.usuarioId);
            res.json({ success: true, total: reservas.length, data: reservas });
        } catch (error) {
            res.status(500).json({ success: false, mensaje: 'Error al obtener reservas del usuario', error: error.message });
        }
    },

    crear: (req, res) => {
        try {
            const errores = validationResult(req);
            if (!errores.isEmpty()) {
                return res.status(400).json({ success: false, errores: errores.array() });
            }

            const { usuario_id, servicio_id, fecha_reserva, hora_inicio, hora_fin } = req.body;

            const usuario = Usuario.findById(usuario_id);
            if (!usuario) {
                return res.status(404).json({ success: false, mensaje: 'El usuario no existe' });
            }

            const servicio = Servicio.findById(servicio_id);
            if (!servicio) {
                return res.status(404).json({ success: false, mensaje: 'El servicio no existe' });
            }

            if (!servicio.activo) {
                return res.status(400).json({ success: false, mensaje: 'El servicio no está disponible' });
            }

            const conflicto = Reserva.verificarConflictoUsuario(usuario_id, fecha_reserva, hora_inicio, hora_fin);
            if (conflicto) {
                return res.status(409).json({
                    success: false,
                    mensaje: 'El usuario ya tiene una reserva en ese horario'
                });
            }

            const disponible = Servicio.verificarDisponibilidad(servicio_id, fecha_reserva, hora_inicio, hora_fin);
            if (!disponible) {
                return res.status(409).json({
                    success: false,
                    mensaje: 'El servicio no tiene disponibilidad en ese horario'
                });
            }

            const nuevaReserva = Reserva.create(req.body);
            res.status(201).json({ success: true, mensaje: 'Reserva creada exitosamente', data: nuevaReserva });
        } catch (error) {
            res.status(500).json({ success: false, mensaje: 'Error al crear reserva', error: error.message });
        }
    },

    actualizarEstado: (req, res) => {
        try {
            const reserva = Reserva.findById(req.params.id);
            if (!reserva) {
                return res.status(404).json({ success: false, mensaje: 'Reserva no encontrada' });
            }

            const { estado } = req.body;
            const estadosValidos = ['pendiente', 'confirmada', 'cancelada', 'completada'];
            if (!estadosValidos.includes(estado)) {
                return res.status(400).json({ success: false, mensaje: 'Estado no válido' });
            }

            Reserva.updateEstado(req.params.id, estado);
            const reservaActualizada = Reserva.findById(req.params.id);
            res.json({ success: true, mensaje: 'Estado de reserva actualizado', data: reservaActualizada });
        } catch (error) {
            res.status(500).json({ success: false, mensaje: 'Error al actualizar estado', error: error.message });
        }
    },

    eliminar: (req, res) => {
        try {
            const reserva = Reserva.findById(req.params.id);
            if (!reserva) {
                return res.status(404).json({ success: false, mensaje: 'Reserva no encontrada' });
            }

            Reserva.delete(req.params.id);
            res.json({ success: true, mensaje: 'Reserva eliminada exitosamente' });
        } catch (error) {
            res.status(500).json({ success: false, mensaje: 'Error al eliminar reserva', error: error.message });
        }
    }
};

module.exports = reservaController;