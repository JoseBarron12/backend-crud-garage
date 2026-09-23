const {Router} = require('express');
const controller = require("../controllers/clientController");

const clientRouter = Router();

clientRouter.get("/", controller.clientListGet);

module.exports = clientRouter;