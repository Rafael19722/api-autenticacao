const jwt = require('jsonwebtoken');
require('dotenv').config();

//variável do .env que vai dar a palavra passe 
const secret = process.env.JWT_SECRET;

//função responsável por autenticar o login pelo token
function authMiddleware(req, res, next) {
    //vai pegar o schema e o token do header
    const authHeader = req.headers.authorization;

    //caso não haja a authorization no header retorna a mensagem de token não fornecido
    if (!authHeader) {
        return res.status(401).json({error: 'Token não fornecido'});
    }

    //vai dividir o authorization do header
    const parts = authHeader.split(' ');

    //caso o header tenha mais do que dois index ou menos de dois
    if (parts.length !== 2) {
        return res.status(401).json({error: 'Token mal formatado'});
    }

    //caso tenha dois então ele separa em scheme e token
    const [scheme, token] = parts; // bearer + token

    //vai verificar o tipo que veio no scheme, se não for bearer ele retorna token mal formatado
    if (!/^Bearer$/i.test(scheme)) {
        return res.status(401).json({error: 'Token mal formatado'});
    }

    try {
        //caso esteja tudo correto em relação ao recebimento ele vai fazer a verificação do token
        const decoded = jwt.verify(token, secret);

        //e então ele vai pegar os dados desejados
        req.user = {
            id: decoded.id,
            name: decoded.name,
            email: decoded.email
        };
        //assim ele vai fazer com que a próxima requisição aconteça
        return next();
    } catch (err) {
        return res.status(401).json({error: 'Token inválido'});
    }
}

module.exports = authMiddleware;