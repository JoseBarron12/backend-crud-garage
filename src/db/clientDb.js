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

async function updateClientId(id, data) {
    if(data.name != "") {
        await prisma.client.update({
            where: { id: Number(id)},
            data : {name: data.name}
        })
    } 
    
    if (data.phoneNumber != "") {
        await prisma.client.update({
            where: { id: Number(id)},
            data : { phoneNumber: data.phone}
        })
    } 
    
    if(data.email != "") {
        await prisma.client.update({
            where: { id: Number(id)},
            data : {email: data.email}
        })
    } 
    
    if(data.address != "") {
        await prisma.client.update({
            where: { id: Number(id)},
            data : {address: data.address}
        })    
    } 
    
}

module.exports = {
    getAllClients,
    getClientById,
    createClient,
    deleteAllClients,
    deleteClientById,
    updateClientId
}