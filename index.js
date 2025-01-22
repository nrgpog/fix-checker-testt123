const express = require('express');
const path = require('path');
const app = express();

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Rutas API
app.use('/api/basic', require('./api/basic.js'));
app.use('/api/pro', require('./api/pro.js'));
app.use('/api/luhn', require('./api/luhn.js'));
app.use('/api/lookup', require('./api/lookup.js'));

// Rutas de páginas
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/gen', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'gen.html'));
});

// Ruta para manejar 404
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Checker: http://localhost:${PORT}`);
    console.log(`Generator: http://localhost:${PORT}/gen`);
});

// Manejo de errores
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});