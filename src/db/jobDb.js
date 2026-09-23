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

module.exports = {
    getAllJobs
}