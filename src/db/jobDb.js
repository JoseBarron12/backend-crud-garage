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

async function createJob(data) {
    await prisma.job.create({
        data: {
            desc: data.desc,
            costCent: Number(data.costCent),
            createdAt: data.createdAt,
            doneAt: data.doneAt,
            progress: data.progress,
            employeeId: Number(data.employeeId),
            clientId: Number(data.clientId)
        }
    })
}


module.exports = {
    getAllJobs,
    getJobById,
    createJob
}