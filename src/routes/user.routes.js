const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/me', authMiddleware, (req, res) => {
    return res.json({
        message: 'Dados do usuário autenticado',
        user: req.user
    });
});

module.exports = router;