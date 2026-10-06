const { isAdmin, isAuth } = require('../config/authentication');
const db = require('../db/employeeDb')

const employeeListGet = async (req, res) => {
    const employees = await db.getAllEmployees();
    res.json({employees});
}

const employeeGet = async (req, res) => {
    
    const auth = await isAuth(req,req.params.id);

    if(!auth) {
        return res.sendStatus(403);
    }

    const employee = await db.getEmployeeById(Number(req.params.id));
    res.json({employee});
}

const employeePost = async (req,res, next) => {
    try{
        await db.createEmployee(req.body);
        res.sendStatus(200);
    } catch (err) {
        console.log(err);
        next(err)
    }
}

const employeeListDelete = async(req, res, next) => {
    try {
        await db.deleteAllEmployees();
        res.sendStatus(200);
    } catch (err) {
        console.log(err);
        next(err);
    }
}

const employeeDelete = async (req , res, next) => {
    try {
        await db.deleteEmployeeByID(req.params.id);
        res.sendStatus(200);
    } catch(err) {
        console.log(err);
        next(err);
    }
}

const employeePut = async (req, res, next) => {
    try {
        await db.updateEmployeeById(req.params.id, req.body);
        res.sendStatus(200);
    } catch(err) {
        console.log(err);
        next(err);
    }
}


module.exports = {
    employeeListGet,
    employeeGet,
    employeePost,
    employeeListDelete,
    employeeDelete,
    employeePut
}