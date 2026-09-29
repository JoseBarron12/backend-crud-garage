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

module.exports = {
    jobListGet,
    jobGet,
    jobPost
}