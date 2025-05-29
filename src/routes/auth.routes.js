const express = require('express'); // pra criar as rotas
const bcrypt = require('bcrypt'); // pra criptografar as senhas
const prisma = require('../prismaClient'); // pro client ORM acessar o banco
const jwt = require('jsonwebtoken'); // cria o token do usuário
require('dotenv').config();

// pega a chave do segredo do .env
const secret = process.env.JWT_SECRET;

//cria as rotas
const router = express.Router();

//endpoint responsável pelo registro no banco 
router.post('/register', async (req, res) => {
    //variáveis de entrada
    const { name, email, password} = req.body;

    //caso não venha algumas das informações no json
    if (!name || !email || !password) {
        return res.status(400).json({error: "Por favor preencha todos os campos!"})
    }

    // caso as informações venham corretas
    try {
        // vai verificar se o usuário já existe no banco pelo email que é único
        const existingUser = await prisma.user.findUnique({
            where: {email},
        });

        // caso exista ele vai retornar a mensagem dizendo que o email já está cadastrado
        if (existingUser) {
            return res.status(400).json({error: 'Este e-mail já está cadastrado.'})
        }

        //caso o usuário não exista ele vai fazer o hash da senha
        const hashedPassword = await bcrypt.hash(password, 10);

        // e então ele vai colocar no banco o cadastro do usuário com a senha criptografada
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });

        //retorna um json com os parâmetros de criação do cadastro
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

//endpoint responsável pelo login
router.post('/login', async (req, res) => {
    //variáveis de entrada
    const { email, password } = req.body;

    try {
        // vai atribuir a user a linha do cadastro caso ele exista no banco
        const user = await prisma.user.findUnique({
            where: {email}
        });

        //caso as informações não batam com as do banco retorna usuário não encontrado
        if (!user) {
            return res.status(404).json({error: 'Usuário não encontrado'});
        }

        //caso o usuário exista vai ser feita a comparação das senhas
        const passwordMatch = await bcrypt.compare(password, user.password);

        //caso as senhas não sejam compatíveis
        if (!passwordMatch) {
            return res.status(401).json({error: 'Senha incorreta'});
        }

        //vai gerar o token de login, retornando o id, nome e email do usuário para possíveis usos futuros
        const token = jwt.sign(
            {
                id: user.id,
                name: user.name,
                email: user.email
            },
            secret, // é o responsável por decodificar
            {expiresIn: '1d'} // o tempo que o token vai durar
        );

        // em caso de sucesso retorna a mensagem de sucesso e junto a ela o token
        return res.json({
            message: 'Login realizado com sucesso',
            token
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({error: 'Erro interno no servidor.'});
    }
});

//exporta as rotas
module.exports = router;