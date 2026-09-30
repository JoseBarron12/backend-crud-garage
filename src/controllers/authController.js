const { createEmployee, getEmployeeByUsername } = require("../db/employeeDb")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

process.loadEnvFile()

const employeeRegister = async (req, res, next) => {
    try {
        await createEmployee(req.body);
        res.sendStatus(200);
    } catch (err) {
        console.log(err);
        next(err);
    }
}

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
        console.log(err);
        next(err);
    }

}


module.exports = {
    employeeRegister,
    employeeLogin
}