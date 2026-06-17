const Servicio = require('../models/Servicio');
const { validationResult } = require('express-validator');

const servicioController = {
    obtenerTodos: (req, res) => {
        try {
            const { activo } = req.query;
            const servicios = Servicio.findAll(activo);
            res.json({ success: true, total: servicios.length, data: servicios });
        } catch (error) {
            res.status(500).json({ success: false, mensaje: 'Error al obtener servicios', error: error.message });
        }
    },

    obtenerPorId: (req, res) => {
        try {
            const servicio = Servicio.findById(req.params.id);
            if (!servicio) {
                return res.status(404).json({ success: false, mensaje: 'Servicio no encontrado' });
            }
            res.json({ success: true, data: servicio });
        } catch (error) {
            res.status(500).json({ success: false, mensaje: 'Error al obtener servicio', error: error.message });
        }
    },

    crear: (req, res) => {
        try {
            const errores = validationResult(req);
            if (!errores.isEmpty()) {
                return res.status(400).json({ success: false, errores: errores.array() });
            }

            const nuevoServicio = Servicio.create(req.body);
            res.status(201).json({ success: true, mensaje: 'Servicio creado exitosamente', data: nuevoServicio });
        } catch (error) {
            res.status(500).json({ success: false, mensaje: 'Error al crear servicio', error: error.message });
        }
    },

    actualizar: (req, res) => {
        try {
            const servicio = Servicio.findById(req.params.id);
            if (!servicio) {
                return res.status(404).json({ success: false, mensaje: 'Servicio no encontrado' });
            }

            Servicio.update(req.params.id, req.body);
            const servicioActualizado = Servicio.findById(req.params.id);
            res.json({ success: true, mensaje: 'Servicio actualizado exitosamente', data: servicioActualizado });
        } catch (error) {
            res.status(500).json({ success: false, mensaje: 'Error al actualizar servicio', error: error.message });
        }
    },

    eliminar: (req, res) => {
        try {
            const servicio = Servicio.findById(req.params.id);
            if (!servicio) {
                return res.status(404).json({ success: false, mensaje: 'Servicio no encontrado' });
            }

            Servicio.delete(req.params.id);
            res.json({ success: true, mensaje: 'Servicio eliminado exitosamente' });
        } catch (error) {
            res.status(500).json({ success: false, mensaje: 'Error al eliminar servicio', error: error.message });
        }
    }
};

module.exports = servicioController;