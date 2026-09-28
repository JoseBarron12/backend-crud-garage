const prisma = require("../../lib/prisma");

async function getAllJobs() {
    const jobs = await prisma.job.findMany({
        include: {
            employee: true,
            client: true,
        }
    });
    return jobs;
}

async function getJobById(id) {
    const job = await prisma.job.findUnique({
        where: {
            id: id
        },
        include: {
            employee: true,
            client: true
        }
    })
    return job;
}


module.exports = {
    getAllJobs,
    getJobById
}