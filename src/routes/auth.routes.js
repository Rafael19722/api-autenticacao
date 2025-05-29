const express = require('express'); // pra criar as rotas
const bcrypt = require('bcrypt'); // pra criptografar as senhas
const prisma = require('../prismaClient'); // pro client ORM acessar o banco
const jwt = require('jsonwebtoken'); // cria o token do usuário
require('dotenv').config();

const secret = process.env.JWT_SECRET;

const router = express.Router();

router.post('/register', async (req, res) => {
    const { name, email, password} = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({error: "Por favor preencha todos os campos!"})
    }

    try {
        const existingUser = await prisma.user.findUnique({
            where: {email},
        });

        if (existingUser) {
            return res.status(400).json({error: 'Este e-mail já está cadastrado.'})
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });

        return res.status(201).json({
            id: user.id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: 'Erro interno do servidor.'})
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: {email}
        });

        if (!user) {
            return res.status(404).json({error: 'Usuário não encontrado'});
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({error: 'Senha incorreta'});
        }

        const token = jwt.sign(
            {
                id: user.id,
                name: user.name,
                email: user.email
            },
            secret,
            {expiresIn: '1d'}
        );

        return res.json({
            message: 'Login realizado com sucesso',
            token
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({error: 'Erro interno no servidor.'});
    }
});

module.exports = router;