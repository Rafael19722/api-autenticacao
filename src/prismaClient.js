// é o ORM que vai fazer com que dê pra usar comandos javascript no lugar de sql puro
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = prisma;