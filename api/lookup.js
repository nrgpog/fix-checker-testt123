const express = require('express');
const router = express.Router();
const _0x4f8a=["\x68\x74\x74\x70\x73\x3A\x2F\x2F\x6C\x6F\x6F\x6B\x75\x70\x2E\x62\x69\x6E\x2F","\x7C","\x73\x70\x6C\x69\x74","\x47\x45\x54","\x61\x70\x70\x6C\x69\x63\x61\x74\x69\x6F\x6E\x2F\x6A\x73\x6F\x6E","\x6A\x73\x6F\x6E"];
async function getBinInfo(bin) {
    try {
        const response = await fetch(`${_0x4f8a[0]}${bin}`, {
            method: _0x4f8a[3],
            headers: {
                'Accept': _0x4f8a[4]
            }
        });
        return await response[_0x4f8a[5]]();
    } catch(e) {
        return null;
    }
}
async function processCard(card) {
    const parts = card[_0x4f8a[2]](_0x4f8a[1]);
    const bin = parts[0].substring(0, 6);
    const binData = await getBinInfo(bin);

    return binData ? {
        bin: bin,
        brand: binData.brand || 'N/A',
        type: binData.type || 'N/A',
        level: binData.level || 'N/A',
        bank: binData.bank?.name || 'N/A',
        country: binData.country?.name || 'N/A',
        prepaid: binData.prepaid ? 'Yes' : 'No'
    } : null;
}
router.post('/check', async (req, res) => {
    try {
        const { card } = req.body;

        if (!card) {
            return res.status(400).json({
                success: false,
                error: 'Card number required'
            });
        }

        const binInfo = await processCard(card);

        res.json({
            success: true,
            data: binInfo
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Lookup failed'
        });
    }
});

module.exports = router;