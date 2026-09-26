const {Router} = require('express');
const controller = require("../controllers/employeeController");

const employeeRouter = Router();

employeeRouter.get("/", controller.employeeListGet);
employeeRouter.get("/:id", controller.employeeGet);

module.exports = employeeRouter;