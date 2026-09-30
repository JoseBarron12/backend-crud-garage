const { createEmployee } = require("../db/employeeDb")

const employeeRegister = async (req, res, next) => {
    try{
        await createEmployee(req.body);
        res.sendStatus(200);
    } catch (err) {
        console.log(err);
        next(err);
    }
}

module.exports = {
    employeeRegister
}