const {Router} = require('express');
const controller = require("../controllers/employeeController");

const employeeRouter = Router();

employeeRouter.get("/", controller.employeeListGet);
employeeRouter.get("/:id", controller.employeeGet);

employeeRouter.post("/", controller.employeePost);

employeeRouter.delete("/", controller.employeeListDelete);
employeeRouter.delete("/:id", controller.employeeDelete);

module.exports = employeeRouter;