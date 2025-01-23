const express = require('express');
const path = require('path');
const app = express();

// Middleware
app.use(express.json());
app.use(express.static('public'));

// API routes
app.use('/api/basic', require('./api/basic.js'));
app.use('/api/pro', require('./api/pro.js'));
app.use('/api/luhn', require('./api/luhn.js'));

// Main routes
app.get('/', (_, res) => {
    res.sendFile(path.join(__dirname, 'public', 'chk.html'));
});

app.get('/gen', (_, res) => {
    res.sendFile(path.join(__dirname, 'public', 'gen.html'));
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT);

module.exports = app;
