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

async function createClient(data) {
    await prisma.client.create({
        data: {
            name: data.name,
            email: data.email,
            phoneNumber: data.phone,
            address: data.address,

        }
    })
}

async function deleteAllClients() {
    await prisma.client.deleteMany();
}

async function deleteClientById(id) {
    await prisma.client.delete({
        where: {
            id: Number(id)
        }
    });
}

module.exports = {
    getAllClients,
    getClientById,
    createClient,
    deleteAllClients,
    deleteClientById
}