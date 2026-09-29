const { Router } = require('express');
const controller = require('../controllers/jobController');

const jobRouter = Router();

jobRouter.get("/", controller.jobListGet);
jobRouter.get("/:id", controller.jobGet);

jobRouter.post("/", controller.jobPost);

jobRouter.delete("/", controller.jobListDelete);
jobRouter.delete("/:id", controller.jobDelete);

module.exports = jobRouter;