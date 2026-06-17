const app = require('./src/app');
const { initDatabase } = require('./src/config/database');

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        await initDatabase();
        app.listen(PORT, () => {
            console.log('🚀 Servidor corriendo en http://localhost:${PORT}');
            console.log('📖 Documentación en http://localhost:${PORT}/api-docs');
        });
    } catch (error) {
        console.error('❌ Error al iniciar el servidor:', error);
        process.exit(1);
    }
}

startServer();