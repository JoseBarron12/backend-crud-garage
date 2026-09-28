const { Router } = require('express');
const controller = require('../controllers/jobController');

const jobRouter = Router();

jobRouter.get("/", controller.jobListGet);
jobRouter.get("/:id", controller.jobGet)

module.exports = jobRouter;