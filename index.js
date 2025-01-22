const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static('public'));

// API routes
app.use('/api/basic', require('./api/basic.js'));
app.use('/api/pro', require('./api/pro.js'));
app.use('/api/luhn', require('./api/luhn.js'));

// Rutas principales
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'chk.html'));
});

app.get('/chk', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'chk.html'));
});

app.get('/gen', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'gen.html'));
});

// Manejo de archivos estáticos
app.get('/styles.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'styles.css'));
});

app.get('/script.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'script.js'));
});

// Manejo de 404
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', 'chk.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
