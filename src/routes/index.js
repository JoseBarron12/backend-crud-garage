const {Router} = require("express");
const employeeRouter = require("./employee");
const clientRouter = require("./client");
const jobRouter = require("./job");

const indexRouter = Router();


indexRouter.use("/employee", employeeRouter);
indexRouter.use("/client", clientRouter);
indexRouter.use("/job", jobRouter);

indexRouter.get("/", (req, res) => {
    res.json({text: "hello"});
})


module.exports = indexRouter;