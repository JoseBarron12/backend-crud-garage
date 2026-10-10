const { isAuth } = require('../config/authentication');
const db = require('../db/jobDb');

const jobListGet = async (req, res) => {
    const jobs = await db.getAllJobs();
    res.json({jobs});
}

const jobGet = async (req, res) => {
    const job = await db.getJobById(Number(req.params.id));
    res.json({job});
}

const jobPost = async (req,res, next) => {
    try {
        await db.createJob(req.body);
        res.sendStatus(200);
    }catch (err) {
        console.log(err);
        next(err);
    }
}

const jobListDelete = async (req, res, next) => {
    try {
        await db.deleteAllJobs();
        res.sendStatus(200);
    } catch (err) {
        console.log(err);
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
        console.log(err);
        next(err);
    }
}

const jobPut = async(req, res, next) => {
    try {
        await db.updateJobById(req.params.id, req.body);
        sendStatus(200);
    } catch (err) {
        console.log(err);
        next(err);
    }
}

module.exports = {
    jobListGet,
    jobGet,
    jobPost,
    jobListDelete,
    jobDelete,
    jobPut
}