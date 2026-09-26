const prisma = require("../../lib/prisma");

async function getAllEmployees() {
    const employees = await prisma.employee.findMany({
        include: {
            jobs: true,
        }

    });
    return employees;
}

async function getEmployeeById(id) {
    const employee = await prisma.employee.findUnique({
        where: {id: id},
        include: {
            jobs: true,
        }
    });

    return employee;
}


module.exports = {
    getAllEmployees,
    getEmployeeById
}


