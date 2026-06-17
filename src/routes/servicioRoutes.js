const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const servicioController = require('../controllers/servicioController');

router.get('/', servicioController.obtenerTodos);
router.get('/:id', servicioController.obtenerPorId);

router.post('/', [
    body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
    body('duracion_minutos').isInt({ min: 1 }).withMessage('La duración debe ser mayor a 0'),
    body('precio').isFloat({ min: 0 }).withMessage('El precio debe ser un número positivo')
], servicioController.crear);

router.put('/:id', servicioController.actualizar);
router.delete('/:id', servicioController.eliminar);

module.exports = router;