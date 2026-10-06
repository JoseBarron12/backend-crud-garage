const {Router} = require('express');
const controller = require("../controllers/employeeController");
const { isAdmin } = require('../config/authentication');

const employeeRouter = Router();

employeeRouter.get("/", isAdmin ,controller.employeeListGet);
employeeRouter.get("/:id", controller.employeeGet);

employeeRouter.post("/", isAdmin, controller.employeePost);

employeeRouter.delete("/", controller.employeeListDelete);
employeeRouter.delete("/:id", controller.employeeDelete);

employeeRouter.put("/:id", controller.employeePut);

module.exports = employeeRouter;