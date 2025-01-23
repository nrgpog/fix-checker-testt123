const express = require('express');
const app = express();

app.use(express.json());
app.use(express.static('public'));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: 'Server Error',
        message: 'Gateway Error | .gg/aeolous'
    });
});

// API routes with error handling
app.use('/api/basic', require('./api/basic.js'));
app.use('/api/pro', require('./api/pro.js'));
app.use('/api/luhn', require('./api/luhn.js'));

// Main routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'chk.html'));
});

app.get('/gen', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'gen.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT);

module.exports = app;
