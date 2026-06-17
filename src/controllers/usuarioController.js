const Usuario = require('../models/Usuario');
const { validationResult } = require('express-validator');

const usuarioController = {
    obtenerTodos: (req, res) => {
        try {
            const usuarios = Usuario.findAll();
            res.json({
                success: true,
                total: usuarios.length,
                data: usuarios
            });
        } catch (error) {
            res.status(500).json({ success: false, mensaje: 'Error al obtener usuarios', error: error.message });
        }
    },

    obtenerPorId: (req, res) => {
        try {
            const usuario = Usuario.findById(req.params.id);
            if (!usuario) {
                return res.status(404).json({ success: false, mensaje: 'Usuario no encontrado' });
            }
            res.json({ success: true, data: usuario });
        } catch (error) {
            res.status(500).json({ success: false, mensaje: 'Error al obtener usuario', error: error.message });
        }
    },

    crear: (req, res) => {
        try {
            const errores = validationResult(req);
            if (!errores.isEmpty()) {
                return res.status(400).json({ success: false, errores: errores.array() });
            }

            const existente = Usuario.findByEmail(req.body.email);
            if (existente) {
                return res.status(409).json({ success: false, mensaje: 'El email ya está registrado' });
            }

            const nuevoUsuario = Usuario.create(req.body);
            res.status(201).json({ success: true, mensaje: 'Usuario creado exitosamente', data: nuevoUsuario });
        } catch (error) {
            res.status(500).json({ success: false, mensaje: 'Error al crear usuario', error: error.message });
        }
    },

    actualizar: (req, res) => {
        try {
            const usuario = Usuario.findById(req.params.id);
            if (!usuario) {
                return res.status(404).json({ success: false, mensaje: 'Usuario no encontrado' });
            }

            const errores = validationResult(req);
            if (!errores.isEmpty()) {
                return res.status(400).json({ success: false, errores: errores.array() });
            }

            Usuario.update(req.params.id, req.body);
            const usuarioActualizado = Usuario.findById(req.params.id);
            res.json({ success: true, mensaje: 'Usuario actualizado exitosamente', data: usuarioActualizado });
        } catch (error) {
            res.status(500).json({ success: false, mensaje: 'Error al actualizar usuario', error: error.message });
        }
    },

    eliminar: (req, res) => {
        try {
            const usuario = Usuario.findById(req.params.id);
            if (!usuario) {
                return res.status(404).json({ success: false, mensaje: 'Usuario no encontrado' });
            }

            Usuario.delete(req.params.id);
            res.json({ success: true, mensaje: 'Usuario eliminado exitosamente' });
        } catch (error) {
            res.status(500).json({ success: false, mensaje: 'Error al eliminar usuario', error: error.message });
        }
    }
};

module.exports = usuarioController;