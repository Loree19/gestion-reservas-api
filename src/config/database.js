const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

let db = null;

const dbPath = path.join(__dirname, '..', '..', 'database', 'reservas.db');

// Crear carpeta database si no existe
const dbDir = path.join(__dirname, '..', '..', 'database');
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

async function initDatabase() {
    const SQL = await initSqlJs();
    
    // Cargar base de datos existente o crear nueva
    if (fs.existsSync(dbPath)) {
        const fileBuffer = fs.readFileSync(dbPath);
        db = new SQL.Database(fileBuffer);
    } else {
        db = new SQL.Database();
    }

    // Crear tablas si no existen
    db.run(`
        CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            apellido TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            telefono TEXT,
            documento TEXT UNIQUE NOT NULL,
            rol TEXT DEFAULT 'cliente' CHECK(rol IN ('cliente', 'administrador')),
            fecha_registro TEXT DEFAULT (datetime('now'))
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS servicios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            descripcion TEXT,
            duracion_minutos INTEGER NOT NULL,
            precio REAL NOT NULL,
            capacidad INTEGER DEFAULT 1,
            activo INTEGER DEFAULT 1,
            fecha_creacion TEXT DEFAULT (datetime('now'))
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS reservas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            usuario_id INTEGER NOT NULL,
            servicio_id INTEGER NOT NULL,
            fecha_reserva TEXT NOT NULL,
            hora_inicio TEXT NOT NULL,
            hora_fin TEXT NOT NULL,
            estado TEXT DEFAULT 'pendiente' CHECK(estado IN ('pendiente', 'confirmada', 'cancelada', 'completada')),
            observaciones TEXT,
            fecha_creacion TEXT DEFAULT (datetime('now')),
            FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
            FOREIGN KEY (servicio_id) REFERENCES servicios(id) ON DELETE CASCADE
        )
    `);

    // Guardar base de datos
    saveDatabase();

    console.log('✅ Base de datos inicializada correctamente');
}

function saveDatabase() {
    if (db) {
        const data = db.export();
        const buffer = Buffer.from(data);
        fs.writeFileSync(dbPath, buffer);
    }
}

// Función helper para ejecutar consultas
function query(sql, params = []) {
    if (!db) throw new Error('Base de datos no inicializada');
    const stmt = db.prepare(sql);
    if (params.length > 0) {
        stmt.bind(params);
    }
    return stmt;
}

// Función helper para obtener todos los resultados
function all(sql, params = []) {
    const stmt = query(sql, params);
    const results = [];
    while (stmt.step()) {
        results.push(stmt.getAsObject());
    }
    stmt.free();
    return results;
}

// Función helper para obtener un solo resultado
function get(sql, params = []) {
    const stmt = query(sql, params);
    let result = null;
    if (stmt.step()) {
        result = stmt.getAsObject();
    }
    stmt.free();
    return result;
}

// Función helper para ejecutar (INSERT, UPDATE, DELETE)
function run(sql, params = []) {
    const stmt = query(sql, params);
    stmt.step();
    stmt.free();
    saveDatabase();
    return db;
}

// Función para obtener el último ID insertado
function getLastInsertRowId() {
    const result = get('SELECT last_insert_rowid() as id');
    return result ? result.id : 0;
}

module.exports = { db, initDatabase, all, get, run, getLastInsertRowId, saveDatabase };