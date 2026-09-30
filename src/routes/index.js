const {Router} = require("express");
const employeeRouter = require("./employee");
const clientRouter = require("./client");
const jobRouter = require("./job");
const authRouter = require("./auth")

const indexRouter = Router();

indexRouter.use("/register", authRouter);
indexRouter.use("/employee", employeeRouter);
indexRouter.use("/client", clientRouter);
indexRouter.use("/job", jobRouter);

indexRouter.get("/", (req, res) => {
    res.json({text: "hello"});
})


module.exports = indexRouter;