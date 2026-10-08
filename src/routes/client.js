const {Router} = require('express');
const controller = require("../controllers/clientController");
const { isAdmin } = require('../config/authentication');

const clientRouter = Router();

clientRouter.get("/", controller.clientListGet);
clientRouter.get("/:id", controller.clientGet);

clientRouter.post("/", controller.clientPost);

clientRouter.delete("/", isAdmin, controller.clientListDelete);
clientRouter.delete("/:id", isAdmin, controller.clientDelete);

clientRouter.post("/:id", controller.clientPut);

module.exports = clientRouter;