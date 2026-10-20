const { createEmployee, getEmployeeByUsername } = require("../db/employeeDb")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { validateEmployeePost } = require("../config/input");
const { validationResult, matchedData } = require("express-validator");

process.loadEnvFile()

const employeeRegister = [ 
    validateEmployeePost, 
    async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        const errorMsg = errors.array()[0].msg;
        return res.status(400).json({errorMsg});
    }
    
    try {
        const employee = await createEmployee(matchedData(req), true);

        const payload = { id: employee.id, username: employee.username}

        jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '30d'}, (err, token) => {
            if(err) throw err;
            res.json({
                token: token,
            })
        });
    } catch (err) {
        next(err);
    }
}]

const employeeLogin = async (req, res, next) => {
    const {username, password} = req.body;
    
    try {
        const employee = await getEmployeeByUsername(username);
        if(!employee) return res.sendStatus(400);

        const match = await bcrypt.compare(password, employee.hashpassword);

        if(!match) return res.sendStatus(400);
        
        const payload = { id: employee.id, username: employee.username}

        jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '30d'}, (err, token) => {
            if(err) throw err;
            res.json({
                token: token,
            })
        });

    } catch(err) {
        next(err);
    }

}


module.exports = {
    employeeRegister,
    employeeLogin
}