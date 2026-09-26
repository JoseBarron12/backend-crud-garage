const db = require('../db/employeeDb')

const employeeListGet = async (req, res) => {
    const employees = await db.getAllEmployees();
    res.json({employees});
}

const employeeGet = async (req, res) => {
    const employee = await db.getEmployeeById(Number(req.params.id));
    res.json({employee});
}

const employeePost = async (req,res, next) => {
    try{
        await db.createEmployee(req.body);
        res.status(200).redirect("/");
    } catch (err) {
        console.log(err);
        next(err)
    }
}

module.exports = {
    employeeListGet,
    employeeGet,
    employeePost
}