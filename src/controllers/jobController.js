const { validationResult, matchedData } = require('express-validator');
const { isAuth } = require('../config/authentication');
const { validateJobPost, validateEmployeePut } = require('../config/input');
const db = require('../db/jobDb');

const jobListGet = async (req, res) => {
    const jobs = await db.getAllJobs();
    res.json({jobs});
}

const jobGet = async (req, res) => {
    const job = await db.getJobById(Number(req.params.id));
    res.json({job});
}

const jobPost = [ 
    validateJobPost, 
    async (req,res, next) => {
    
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        const errorMsg = errors.array()[0].msg;
        return res.status(400).json({errorMsg});
    }
    
    try {
        await db.createJob(matchedData(req));
        res.sendStatus(200);
    }catch (err) {
        next(err);
    }
}
]

const jobListDelete = async (req, res, next) => {
    try {
        await db.deleteAllJobs();
        res.sendStatus(200);
    } catch (err) {
        next(err);
    }
}

const jobDelete = async(req, res, next) => {
    const job = await db.getJobById(Number(req.params.id));
    const auth = await isAuth(req,job.employeeId);

    if(!auth) {
        return res.sendStatus(403);
    }
    
    try {
        await db.deleteJobById(req.params.id)
        res.sendStatus(200);
    } catch(err) {
        next(err);
    }
}

const jobPut = [
    validateEmployeePut, 
    async(req, res, next) => {
    const job = await db.getJobById(Number(req.params.id));
    const auth = await isAuth(req,job.employeeId);
    
    if(!auth) {
        return res.sendStatus(403);
    }
    
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        const errorMsg = errors.array()[0].msg;
        return res.status(400).json({errorMsg});
    }

    try {
        await db.updateJobById(req.params.id, matchedData(req));
        res.sendStatus(200);
    } catch (err) {
        next(err);
    }
}]

module.exports = {
    jobListGet,
    jobGet,
    jobPost,
    jobListDelete,
    jobDelete,
    jobPut
}