const { isAdmin, isAuth } = require('../config/authentication');
const { validateEmployeePost, validateEmployeePut } = require('../config/input');
const db = require('../db/employeeDb')
const {validationResult, matchedData } = require("express-validator");


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

const employeePost = [
    validateEmployeePost,
    async (req,res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        const errorMsg = errors.array()[0].msg;
        return res.status(400).json({errorMsg});
    }
    try {
        await db.createEmployee(matchedData(req));
        res.sendStatus(200);
    } catch (err) {
        console.log(err);
        next(err)
    }
}]

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

const employeePut = [ 
    validateEmployeePut,
    async (req, res, next) => {
    const auth = await isAuth(req,req.params.id);
    if(!auth) {
        return res.sendStatus(403);
    }
    
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        const errorMsg = errors.array()[0].msg;
        return res.status(400).json({errorMsg});
    }

    try {
        await db.updateEmployeeById(req.params.id, req.body);
        res.sendStatus(200);
    } catch(err) {
        console.log(err);
        next(err);
    }
}
]


module.exports = {
    employeeListGet,
    employeeGet,
    employeePost,
    employeeListDelete,
    employeeDelete,
    employeePut
}