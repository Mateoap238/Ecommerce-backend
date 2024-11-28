import express from 'express';
import morgan from 'morgan';
import db from './database/conection.js';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url'; // Importa fileURLToPath
// Initialize 
const app = express();

// Settings
app.set('port', process.env.PORT || 3000);

// Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors({ origin: '*' }));

// Configura la ruta estática para servir imágenes
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));

// Routes
app.get('/api/products', (req, res) => {
    db.query('SELECT * FROM products', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

app.post('/api/products', (req, res) => {
    const product = req.body;
    db.query('INSERT INTO products SET ?', product, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: result.insertId, ...product });
    });
});

app.put('/api/products/:id', (req, res) => {
    const { id } = req.params;
    const updatedProduct = req.body;
    db.query('UPDATE products SET ? WHERE id = ?', [updatedProduct, id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ id, ...updatedProduct });
    });
});

app.delete('/api/products/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM products WHERE id = ?', [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(204).end();
    });
});

app.get('/', (req, res) => {
    res.json({ message: 'Hello' });
});

// Run server
app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
});