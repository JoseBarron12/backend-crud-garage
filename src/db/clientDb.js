const prisma = require("../../lib/prisma");

async function getAllClients() {
    const clients = await prisma.client.findMany({
        include: {
            jobs: true,
        }

    });
    return clients;
}

module.exports = {
    getAllClients
}