// ============================================
// PASO 2: El backend (servidor)
// Este archivo es el "mozo" entre tu HTML y la base de datos
// ============================================

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

// Le permite al navegador (que corre en otro "origen") hacerle pedidos a este servidor
app.use(cors());
// Permite que el servidor entienda JSON que le mande el frontend
app.use(express.json());

// --- Conexión a la base de datos ---
// Cambiá 'user' y 'password' según tu configuración de MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',        // en XAMPP por defecto no tiene contraseña
    database: 'mi_base'
});

db.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err.message);
        return;
    }
    console.log('✅ Conectado a la base de datos MySQL');
});

// --- Rutas de la API ---

// GET: traer todos los productos
app.get('/api/productos', (req, res) => {
    db.query('SELECT * FROM productos', (err, resultados) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(resultados);
    });
});

// POST: agregar un producto nuevo
app.post('/api/productos', (req, res) => {
    const { nombre, precio } = req.body;

    if (!nombre || !precio) {
        return res.status(400).json({ error: 'Faltan datos: nombre y precio son obligatorios' });
    }

    db.query(
        'INSERT INTO productos (nombre, precio) VALUES (?, ?)',
        [nombre, precio],
        (err, resultado) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: resultado.insertId, nombre, precio });
        }
    );
});

// DELETE: borrar un producto por id
app.delete('/api/productos/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM productos WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ mensaje: 'Producto eliminado' });
    });
});

// --- Iniciar el servidor ---
const PUERTO = 3000;
app.listen(PUERTO, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PUERTO}`);
});
