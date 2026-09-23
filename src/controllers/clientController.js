const db = require('../db/clientDb')

const clientListGet = async (req, res) => {
    const clients = await db.getAllClients();
    res.json({clients});
}

module.exports = {
    clientListGet,
}