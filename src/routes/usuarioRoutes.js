const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const usuarioController = require('../controllers/usuarioController');

router.get('/', usuarioController.obtenerTodos);
router.get('/:id', usuarioController.obtenerPorId);

router.post('/', [
    body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
    body('apellido').notEmpty().withMessage('El apellido es obligatorio'),
    body('email').isEmail().withMessage('Debe ser un email válido'),
    body('documento').notEmpty().withMessage('El documento es obligatorio')
], usuarioController.crear);

router.put('/:id', [
    body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
    body('apellido').notEmpty().withMessage('El apellido es obligatorio'),
    body('email').isEmail().withMessage('Debe ser un email válido'),
    body('documento').notEmpty().withMessage('El documento es obligatorio')
], usuarioController.actualizar);

router.delete('/:id', usuarioController.eliminar);

module.exports = router;