const db = require('../db/employeeDb')

const employeeListGet = async (req, res) => {
    const employees = await db.getAllEmployees();
    res.json({employees});
}

const employeeGet = async (req, res) => {
    const employee = await db.getEmployeeById(Number(req.params.id));
    res.json({employee});
}


module.exports = {
    employeeListGet,
    employeeGet
}