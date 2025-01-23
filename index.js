const express = require('express');
const path = require('path');
const fetch = require('node-fetch');
const app = express();

app.use(express.json());
app.use(express.static('public'));

// Función de logging
const log = (message, data = '') => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${message}`, data);
};

// Basic Checker (xchecker)
app.post('/api/basic/check', async (req, res) => {
    try {
        const { cards } = req.body;
        log('Basic Check Request:', { cards });
        
        const results = await Promise.all(cards.map(async (card) => {
            try {
                log('Checking card:', card);
                const response = await fetch(`https://xchecker.cc/api.php?cc=${card}`);
                const responseText = await response.text();
                log('API Response:', responseText);
                
                let result;
                try {
                    result = JSON.parse(responseText);
                } catch (e) {
                    log('Parse Error:', e);
                    throw new Error('Invalid Response');
                }

                return {
                    card: card,
                    status: result.status,
                    message: `${result.status} | ${result.details || 'Card Declined'} | .gg/aeolous`
                };
            } catch (err) {
                log('Card Check Error:', err.message);
                return {
                    card: card,
                    status: 'Dead',
                    message: 'Card Declined | .gg/aeolous'
                };
            }
        }));

        log('Basic Check Results:', results);
        res.json({
            success: true,
            results: results
        });

    } catch (error) {
        log('Basic Check Error:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error',
            message: 'Card Declined | .gg/aeolous'
        });
    }
});

// Pro Checker
app.post('/api/pro/check', async (req, res) => {
    try {
        const { cards } = req.body;
        log('Pro Check Request:', { cards });
        
        const results = await Promise.all(cards.map(async (card) => {
            try {
                log('Checking card:', card);
                const response = await fetch('https://api.chkr.cc/', {
                    method: 'POST',
                    headers: {
                        'Accept': '*/*',
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: `data=${card}&charge=false`
                });

                const responseText = await response.text();
                log('API Response:', responseText);
                
                let result;
                try {
                    result = JSON.parse(responseText);
                } catch (e) {
                    log('Parse Error:', e);
                    throw new Error('Invalid Response');
                }

                return {
                    card: card,
                    status: result.code === 1 ? 'Live' : 'Dead',
                    message: `${result.status} | ${result.message || 'Card Declined'} | .gg/aeolous`
                };
            } catch (err) {
                log('Card Check Error:', err.message);
                return {
                    card: card,
                    status: 'Dead',
                    message: 'Card Declined | .gg/aeolous'
                };
            }
        }));

        log('Pro Check Results:', results);
        res.json({
            success: true,
            results: results
        });

    } catch (error) {
        log('Pro Check Error:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error',
            message: 'Card Declined | .gg/aeolous'
        });
    }
});

// Log todas las requests
app.use((req, res, next) => {
    log('Request:', {
        method: req.method,
        path: req.path,
        body: req.body,
        headers: req.headers
    });
    next();
});

app.get('/', (req, res) => {
    log('Serving main page');
    res.sendFile(path.join(__dirname, 'public', 'chk.html'));
});

app.get('/gen', (req, res) => {
    log('Serving generator page');
    res.sendFile(path.join(__dirname, 'public', 'gen.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    log(`Server started on port ${PORT}`);
});

// Error handling
app.use((err, req, res, next) => {
    log('Server Error:', err);
    res.status(500).json({
        success: false,
        error: 'Server Error',
        message: 'Card Declined | .gg/aeolous'
    });
});

module.exports = app;
