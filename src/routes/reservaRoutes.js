const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const reservaController = require('../controllers/reservaController');

router.get('/', reservaController.obtenerTodas);
router.get('/:id', reservaController.obtenerPorId);
router.get('/usuario/:usuarioId', reservaController.obtenerPorUsuario);

router.post('/', [
    body('usuario_id').isInt().withMessage('El ID del usuario debe ser un número'),
    body('servicio_id').isInt().withMessage('El ID del servicio debe ser un número'),
    body('fecha_reserva').notEmpty().withMessage('La fecha es obligatoria'),
    body('hora_inicio').matches(/^\d{2}:\d{2}$/).withMessage('Formato de hora inicio inválido (HH:MM)'),
    body('hora_fin').matches(/^\d{2}:\d{2}$/).withMessage('Formato de hora fin inválido (HH:MM)')
], reservaController.crear);

router.patch('/:id/estado', [
    body('estado').isIn(['pendiente', 'confirmada', 'cancelada', 'completada']).withMessage('Estado no válido')
], reservaController.actualizarEstado);

router.delete('/:id', reservaController.eliminar);

module.exports = router;