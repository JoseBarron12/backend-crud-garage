const prisma = require("../../lib/prisma");

async function getAllEmployees() {
    const employees = await prisma.employee.findMany({
        include: {
            jobs: true,
        }

    });
    return employees;
}

module.exports = {
    getAllEmployees
}


