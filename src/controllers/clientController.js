const { validateClientPost, validateClientPut } = require('../config/input');
const db = require('../db/clientDb');
const {validationResult, matchedData } = require("express-validator");


const clientListGet = async (req, res) => {
    const clients = await db.getAllClients();
    res.json({clients});
}

const clientGet = async (req, res) => {
    const client = await db.getClientById(Number(req.params.id));
    res.json({client});
}

const clientPost = [
    validateClientPost,
    async (req, res, next) => {
        const errors = validationResult(req);
        
        if(!errors.isEmpty()) {
            const errorMsg = errors.array()[0].msg;
            return res.status(400).json({errorMsg});
        }
        
        try {
            await db.createClient(matchedData(req));
            res.sendStatus(200);
        } catch (err) {
            next(err)
        }
}]

const clientListDelete = async (req, res, next) => {
    try {
        await db.deleteAllClients();
        res.sendStatus(200);
    } catch(err) {
        next(err);
    }
}

const clientDelete = async (req, res, next) => {
    try {
        
        await db.deleteClientById(req.params.id);
        res.sendStatus(200);
    } catch(err) {
        next(err);
    }
}

const clientPut = [
    validateClientPut,
    async (req,res, next) => {
    const errors = validationResult(req);
        
    if(!errors.isEmpty()) {
        const errorMsg = errors.array()[0].msg;
        return res.status(400).json({errorMsg});
    }
    
    try {
        await db.updateClientId(req.params.id, matchedData(req));
        res.sendStatus(200);
    } catch (err) {
        next(err);
    }
}
]


module.exports = {
    clientListGet,
    clientGet,
    clientPost,
    clientListDelete,
    clientDelete,
    clientPut
}