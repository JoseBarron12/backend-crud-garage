const db = require('../db/employeeDb')

const employeeListGet = async (req, res) => {
    const employees = await db.getAllEmployees();
    res.json({employees});
}

module.exports = {
    employeeListGet
}