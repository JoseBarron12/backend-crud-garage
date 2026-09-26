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

async function deleteAllEmployees() {
    await prisma.employee.deleteMany();
}

async function deleteEmployeeByID(id) {
    await prisma.employee.delete({
        where: {
            id: Number(id),
        }
    })
}

async function updateEmployeeById(id, data) {
    if(data.name != "") {
        await prisma.employee.update({
            where: { id: Number(id)},
            data : {name: data.name}
        })
    } 
    
    if (data.phone != "") {
        await prisma.employee.update({
            where: { id: Number(id)},
            data : { phone: data.phone}
        })
    } 
    
    if(data.email != "") {
        await prisma.employee.update({
            where: { id: Number(id)},
            data : {email: data.email}
        })
    } 
    
    if(data.role != "") {
        await prisma.employee.update({
            where: { id: Number(id)},
            data : {role: data.role}
        })    
    } 
    
    if(data.username != "") {
        await prisma.employee.update({
            where: { id: Number(id)},
            data : {username: data.username}
        })
    } 
    
    if(data.password != "") {
        
        const hashpassword = await bcrypt.hash(data.password, 10);
        await prisma.employee.update({
            where: { id: Number(id)},
            data: {hashpassword: hashpassword}
        })
    }
}



module.exports = {
    getAllEmployees,
    getEmployeeById,
    createEmployee,
    deleteAllEmployees,
    deleteEmployeeByID,
    updateEmployeeById
}


