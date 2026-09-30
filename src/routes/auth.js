const {Router} = require("express");
const controller = require("../controllers/authController");

const authRouter = Router();

authRouter.post("/register", controller.employeeRegister);
authRouter.post("/login", controller.employeeLogin)

module.exports = authRouter;
