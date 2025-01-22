const express = require('express');
const app = express();
const path = require('path');

app.use(express.json());
app.use(express.static('public'));

// API routes
app.use('/api/basic', require('./api/basic.js'));
app.use('/api/pro', require('./api/pro.js'));
app.use('/api/luhn', require('./api/luhn.js'));

// Serve static files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/gen', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'gen.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT);
