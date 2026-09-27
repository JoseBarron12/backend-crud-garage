const db = require('../db/clientDb')

const clientListGet = async (req, res) => {
    const clients = await db.getAllClients();
    res.json({clients});
}

const clientGet = async (req, res) => {
    const client = await db.getClientById(Number(req.params.id));
    res.json({client});
}

const clientPost = async (req, res, next) => {
    try{
        await db.createClient(req.body);
        res.sendStatus(200);
    } catch (err) {
        console.log(err);
        next(err)
    }
}

module.exports = {
    clientListGet,
    clientGet,
    clientPost
}