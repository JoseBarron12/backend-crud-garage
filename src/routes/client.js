const {Router} = require('express');
const controller = require("../controllers/clientController");

const clientRouter = Router();

clientRouter.get("/", controller.clientListGet);
clientRouter.get("/:id", controller.clientGet);

clientRouter.post("/", controller.clientPost);


module.exports = clientRouter;