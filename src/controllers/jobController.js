const db = require('../db/jobDb');

const jobListGet = async (req, res) => {
    const jobs = await db.getAllJobs();
    res.send({jobs});
}

module.exports = {
    jobListGet
}