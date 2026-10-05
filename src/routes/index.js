const {Router} = require("express");
const employeeRouter = require("./employee");
const clientRouter = require("./client");
const jobRouter = require("./job");
const authRouter = require("./auth");
const passport = require("passport");

const indexRouter = Router();

// public routes can be accessed by all
indexRouter.use("/auth", authRouter);

// after this middleware then each route has access to req.user
indexRouter.use("/", passport.authenticate("jwt", {session: false})   );

// protected routes
indexRouter.use("/employee", employeeRouter);
indexRouter.use("/client", clientRouter);
indexRouter.use("/job", jobRouter);

indexRouter.get("/", (req, res) => {
    res.json({text: "hello"});
})


module.exports = indexRouter;