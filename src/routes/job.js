const { Router } = require('express');
const controller = require('../controllers/jobController');
const { isAdmin } = require('../config/authentication');

const jobRouter = Router();

jobRouter.get("/", controller.jobListGet);
jobRouter.get("/:id", controller.jobGet);

jobRouter.post("/", controller.jobPost);

jobRouter.delete("/",isAdmin, controller.jobListDelete);
jobRouter.delete("/:id", controller.jobDelete);

jobRouter.put("/:id", controller.jobPut);

module.exports = jobRouter;