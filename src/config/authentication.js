const prisma = require("../../lib/prisma");

async function isAdmin(req, res, next) {
    if(req.user.role === "ADMIN") {
        next();
    } else
    {
        res.sendStatus(403);
    }
}

async function isAuth(req, id) {
    
    if(req.user.role === "ADMIN" || req.user.id === Number(id)) {
        return true;
    } else
    {
        return false;
    }
}

module.exports = {
    isAdmin,
    isAuth
}