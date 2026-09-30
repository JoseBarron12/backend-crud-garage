const {Router} = require("express");
const controller = require("../controllers/authController");

const authRouter = Router();

authRouter.post("/", controller.employeeRegister);

module.exports = authRouter;
