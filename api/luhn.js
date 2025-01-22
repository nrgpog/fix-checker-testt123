// api/luhn.js
const express = require('express');
const router = express.Router();

// Algoritmo de Luhn
function luhnCheck(cardNumber) {
    let sum = 0;
    let isEven = false;

    // Remover espacios y guiones
    cardNumber = cardNumber.replace(/\D/g, '');

    for (let i = cardNumber.length - 1; i >= 0; i--) {
        let digit = parseInt(cardNumber[i]);

        if (isEven) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }

        sum += digit;
        isEven = !isEven;
    }

    return sum % 10 === 0;
}

// Función para identificar el tipo de tarjeta
function getCardType(cardNumber) {
    const patterns = {
        visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
        mastercard: /^5[1-5][0-9]{14}$/,
        amex: /^3[47][0-9]{13}$/,
        discover: /^6(?:011|5[0-9]{2})[0-9]{12}$/
    };

    for (let [type, pattern] of Object.entries(patterns)) {
        if (pattern.test(cardNumber)) return type;
    }
    return 'unknown';
}

// Función para obtener información del BIN
function getBinInfo(cardNumber) {
    const bin = cardNumber.substring(0, 6);
    // Datos de ejemplo basados en el BIN
    const binRanges = {
        '4': { bank: 'VISA Bank', country: { name: 'United States', emoji: '🇺🇸' }},
        '5': { bank: 'MasterCard Bank', country: { name: 'United Kingdom', emoji: '🇬🇧' }},
        '3': { bank: 'American Express', country: { name: 'Canada', emoji: '🇨🇦' }},
        '6': { bank: 'Discover Bank', country: { name: 'Australia', emoji: '🇦🇺' }}
    };

    return binRanges[cardNumber[0]] || { 
        bank: 'Unknown Bank',
        country: { name: 'Unknown', emoji: '🌍' }
    };
}

router.post('/check', async (req, res) => {
    try {
        const { cards } = req.body;

        if (!Array.isArray(cards) || cards.length > 20) {
            return res.status(400).json({
                success: false,
                error: 'Invalid input'
            });
        }

        const results = [];

        for (const cardData of cards) {
            try {
                // Extraer número de tarjeta
                const [cardNumber] = cardData.split('|');
                const isValid = luhnCheck(cardNumber);
                const cardType = getCardType(cardNumber);
                const binInfo = getBinInfo(cardNumber);

                // Simular delay para parecer más real
                await new Promise(resolve => setTimeout(resolve, 1000));

                const result = {
                    code: isValid ? 1 : 0,
                    status: isValid ? 'Live' : 'Dead',
                    message: isValid ? 'Card is valid (Luhn)' : 'Invalid card number',
                    card: {
                        card: cardData,
                        bank: binInfo.bank,
                        type: cardType,
                        brand: cardType.toUpperCase(),
                        category: isValid ? 'CREDIT' : 'UNKNOWN',
                        country: binInfo.country
                    }
                };

                results.push({
                    card: cardData,
                    ...result
                });

            } catch (error) {
                results.push({
                    card: cardData,
                    code: 2,
                    status: 'Error',
                    message: 'Failed to process card'
                });
            }
        }

        res.json({
            success: true,
            results: results
        });

    } catch (error) {
        console.error('Luhn Gateway Error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error',
            message: error.message
        });
    }
});

module.exports = router;