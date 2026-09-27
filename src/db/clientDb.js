const prisma = require("../../lib/prisma");

async function getAllClients() {
    const clients = await prisma.client.findMany({
        include: {
            jobs: true,
        }

    });

    return clients;
}

async function getClientById(id) {
    const client = await prisma.client.findUnique({
        where: {
            id: id
        },
        include: {
            jobs: true,
        }
    })
    return client;
}

module.exports = {
    getAllClients,
    getClientById
}