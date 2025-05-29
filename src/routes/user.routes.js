const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');

// é a rota protegida que apenas se pode ir com o token válido no header
router.get('/me', authMiddleware, (req, res) => {
    return res.json({
        message: 'Dados do usuário autenticado',
        user: req.user
    });
});

module.exports = router;