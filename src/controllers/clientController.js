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

const clientListDelete = async (req, res, next) => {
    try {
        await db.deleteAllClients();
        res.sendStatus(200);
    } catch(err) {
        console.log(err);
        next(err);
    }
}

const clientDelete = async (req, res, next) => {
    try {
        await db.deleteClientById(req.params.id);
        res.sendStatus(200);
    } catch(err) {
        console.log(err);
        next(err);
    }
}

const clientPut = async (req,res, next) => {
    try {
        await db.updateClientId(req.params.id, req.body);
        res.sendStatus(200);
    } catch (err) {
        console.log(err);
        next(err);
    }
}


module.exports = {
    clientListGet,
    clientGet,
    clientPost,
    clientListDelete,
    clientDelete,
    clientPut
}