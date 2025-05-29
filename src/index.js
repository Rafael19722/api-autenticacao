require('dotenv').config();

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

//pega as rotas de routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');

//faz com que seja possível se comunicar com json
app.use(express.json());

//usa as rotas de routes
app.use('/api', authRoutes);
app.use('/api', userRoutes);

app.get('/', (res, req) => {
    res.send('API rodando')
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`)
});
