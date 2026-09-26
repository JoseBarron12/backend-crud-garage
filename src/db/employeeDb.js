const prisma = require("../../lib/prisma");
const bcrypt = require("bcryptjs");


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

async function createEmployee(data) {
    const hashpassword = await bcrypt.hash(data.password, 10);
    await prisma.employee.create({
        data: {
            name: data.name,
            email: data.email,
            role: data.user,
            phone: data.phone,
            username: data.username,
            hashpassword: hashpassword,
        }
    })
}


module.exports = {
    getAllEmployees,
    getEmployeeById,
    createEmployee
}


