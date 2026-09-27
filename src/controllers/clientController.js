const db = require('../db/clientDb')

const clientListGet = async (req, res) => {
    const clients = await db.getAllClients();
    res.json({clients});
}

const clientGet = async (req, res) => {
    const client = await db.getClientById(Number(req.params.id));
    res.json({client});
}

module.exports = {
    clientListGet,
    clientGet,
}