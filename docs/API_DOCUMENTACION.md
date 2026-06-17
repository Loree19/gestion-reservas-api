# 📖 Documentación API - Gestión de Reservas

## Descripción General
API REST desarrollada en Node.js con Express para la gestión de reservas de servicios.
Permite administrar usuarios, servicios disponibles y reservas con validación de disponibilidad.

Proyecto formativo SENA - Evidencia GA7-220501096-AA5-EV03

## Tecnologías Utilizadas
- *Backend:* Node.js + Express
- *Base de datos:* SQLite (sql.js)
- *Validaciones:* express-validator
- *Documentación:* Swagger (OpenAPI 3.0)
- *Logs:* Morgan

## Instalación y Ejecución

### Requisitos previos
- Node.js v18 o superior
- npm v9 o superior

### Pasos de instalación

```bash
# 1. Clonar o descargar el repositorio
cd gestion-reservas-api

# 2. Instalar dependencias
npm install

# 3. Iniciar el servidor
npm start

# O en modo desarrollo (reinicia automáticamente)
npm run dev