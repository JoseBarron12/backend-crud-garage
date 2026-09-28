const db = require('../db/jobDb');

const jobListGet = async (req, res) => {
    const jobs = await db.getAllJobs();
    res.json({jobs});
}

const jobGet = async (req, res) => {
    const job = await db.getJobById(Number(req.params.id));
    res.json({job});
}

module.exports = {
    jobListGet,
    jobGet
}