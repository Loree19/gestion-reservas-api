const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');

const usuarioRoutes = require('./routes/usuarioRoutes');
const servicioRoutes = require('./routes/servicioRoutes');
const reservaRoutes = require('./routes/reservaRoutes');
const errorHandler = require('./middleware/errorHandler');
const swaggerDocument = require('../docs/swagger.json');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Documentación Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Rutas de la API
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/servicios', servicioRoutes);
app.use('/api/reservas', reservaRoutes);

// Ruta raíz
app.get('/', (req, res) => {
    res.json({
        mensaje: 'API de Gestión de Reservas',
        version: '1.0.0',
        endpoints: {
            usuarios: '/api/usuarios',
            servicios: '/api/servicios',
            reservas: '/api/reservas',
            documentacion: '/api-docs'
        }
    });
});

// Middleware de manejo de errores
app.use(errorHandler);

module.exports = app;