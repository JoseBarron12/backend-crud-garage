const { Router } = require('express');
const controller = require('../controllers/jobController');

const jobRouter = Router();

jobRouter.get("/", controller.jobListGet);

module.exports = jobRouter;