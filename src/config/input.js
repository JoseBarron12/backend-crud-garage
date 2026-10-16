const { body } = require("express-validator")
const { getEmployeeById } = require("../db/employeeDb")
const { getClientById } = require("../db/clientDb")

const emptyErrMsg = (field) => {
    return `${field} is required.`
}

const lengthErrMsg = (min, max) => {
    return `must be between ${min} and ${max} characters.`
}

const validErrMsg = (field) => {
    return `must be a valid ${field}.`
}

const containErrMsg = (type) => {
    return `must only contain ${type}.`
}


const validateEmployeePost = [
    body("name")
    .notEmpty().withMessage(emptyErrMsg("Name"))
    .isLength({min: 2, max: 50}).withMessage(lengthErrMsg(2, 50))
    .matches(/^[A-Za-z\s\-']+$/).withMessage(validErrMsg("name")),
    
    body("email").trim()
    .notEmpty().withMessage(emptyErrMsg("Email"))
    .isEmail().withMessage(validErrMsg("email"))
    .normalizeEmail(),
    
    body("role").trim()
    .notEmpty().withMessage(emptyErrMsg("Role"))
    .isAlpha().withMessage(containErrMsg("letters"))
    .custom((value) => {
        return (value === "USER" || value === "ADMIN")
    }).withMessage(validErrMsg("role")),

    body("phone").trim()
    .notEmpty().withMessage(emptyErrMsg("Phone number"))
    .matches(/^[0-9]{10}$/g).withMessage(validErrMsg("phone number")),

    body("username").trim()
    .notEmpty().withMessage(emptyErrMsg("Username"))
    .isAlphanumeric().withMessage(containErrMsg("letters and numbers"))
    .isLength({min: 2, max: 50}).withMessage(lengthErrMsg(2, 50)),

    body("password").trim()
    .notEmpty().withMessage(emptyErrMsg("Password"))
    .isStrongPassword().withMessage("password must contain a lowercase, uppercase, special character, number, and 8 characters long."),
]

const validateEmployeePut = [
    body("name")
    .optional({ values: "falsy" })
    .notEmpty().withMessage(emptyErrMsg("Name"))
    .isLength({min: 2, max: 50}).withMessage(lengthErrMsg(2, 50))
    .matches(/^[A-Za-z\s\-']+$/).withMessage(validErrMsg("name")),
    
    body("email")
    .optional({ values: "falsy" }).trim()
    .notEmpty().withMessage(emptyErrMsg("Email"))
    .isEmail().withMessage(validErrMsg("email"))
    .normalizeEmail(),
    
    body("role")
    .optional({ values: "falsy" }).trim()
    .notEmpty().withMessage(emptyErrMsg("Role"))
    .isAlpha().withMessage(containErrMsg("letters"))
    .custom((value) => {
        return (value === "USER" || value === "ADMIN")
    }).withMessage(validErrMsg("role")),

    body("phone")
    .optional({ values: "falsy" }).trim()
    .notEmpty().withMessage(emptyErrMsg("Phone number"))
    .matches(/^[0-9]{10}$/g).withMessage(validErrMsg("phone number")),

    body("username")
    .optional({ values: "falsy" }).trim()
    .notEmpty().withMessage(emptyErrMsg("Username"))
    .isAlphanumeric().withMessage(containErrMsg("letters and numbers"))
    .isLength({min: 2, max: 50}).withMessage(lengthErrMsg(2, 50)),

    body("password")
    .optional({ values: "falsy" }).trim()
    .notEmpty().withMessage(emptyErrMsg("Password"))
    .isStrongPassword().withMessage("password must contain a lowercase, uppercase, special character, number, and 8 characters long."),
]

const validateClientPost = [
    body("name")
    .notEmpty().withMessage(emptyErrMsg("Name"))
    .isLength({min: 2, max: 50}).withMessage(lengthErrMsg(2, 50))
    .matches(/^[A-Za-z\s\-']+$/).withMessage(validErrMsg("name")),
    
    body("email").trim()
    .notEmpty().withMessage(emptyErrMsg("Email"))
    .isEmail().withMessage(validErrMsg("email"))
    .normalizeEmail(),

    body("phoneNumber").trim()
    .notEmpty().withMessage(emptyErrMsg("Phone number"))
    .matches(/^[0-9]{10}$/g).withMessage(validErrMsg("phone number")),

    body("address")
    .notEmpty().withMessage(emptyErrMsg("Address"))
    .escape()
    .isLength({min: 15, max: 50}).withMessage(lengthErrMsg(15, 50))
]

const validateClientPut = [
    body("name")
    .optional({ values: "falsy" })
    .notEmpty().withMessage(emptyErrMsg("Name"))
    .isLength({min: 2, max: 50}).withMessage(lengthErrMsg(2, 50))
    .matches(/^[A-Za-z\s\-']+$/).withMessage(validErrMsg("name")),
    
    body("email")
    .optional({ values: "falsy" }).trim()
    .notEmpty().withMessage(emptyErrMsg("Email"))
    .isEmail().withMessage(validErrMsg("email"))
    .normalizeEmail(),

    body("phoneNumber")
    .optional({ values: "falsy" }).trim()
    .notEmpty().withMessage(emptyErrMsg("Phone number"))
    .matches(/^[0-9]{10}$/g).withMessage(validErrMsg("phone number")),

    body("address")
    .optional({ values: "falsy" })
    .notEmpty().withMessage(emptyErrMsg("Address"))
    .escape()
    .isLength({min: 15, max: 50}).withMessage(lengthErrMsg(15, 50))
]

const validateJobPost = [
    body("desc")
    .notEmpty().withMessage(emptyErrMsg("Description"))
    .escape()
    .isLength({min: 15, max: 500}).withMessage(lengthErrMsg(15, 500)),
    
    body("costCent")
    .notEmpty().withMessage(emptyErrMsg("Cost"))
    .isInt({min: 1}).withMessage(validErrMsg("number"))
    .toInt(),
    
    body("createdAt")
    .notEmpty().withMessage(emptyErrMsg("Created Date"))
    .isISO8601().withMessage(validErrMsg("ISO 8601 date")),
    
    body("doneAt")
    .notEmpty().withMessage(emptyErrMsg("Done Date"))
    .isISO8601().withMessage(validErrMsg("ISO 8601 date"))
    .custom((value, {req}) => {
        return value > req.body.createdAt
    }).withMessage(validErrMsg("date that is past created date")),

    body("progress").trim()
    .notEmpty().withMessage(emptyErrMsg("Progress"))
    .isAlpha().withMessage(containErrMsg("letters"))
    .custom((value) => {
        return (value === "COMPLETED" || value === "INPROGRESS" || value === "PENDING" || value === "CANCELED" || value === "PAUSED")
    }).withMessage(validErrMsg("progress")),

    body("employeeId")
    .notEmpty().withMessage(emptyErrMsg("Employee"))
    .isInt().withMessage(validErrMsg("number"))
    .toInt()
    .custom(async value => {
        const response = await getEmployeeById(value);
        if(response === null) return false;
        return true;
    }).withMessage(validErrMsg("employee id")),

    body("clientId")
    .notEmpty().withMessage(emptyErrMsg("Client"))
    .isInt().withMessage(validErrMsg("number"))
    .toInt()
    .custom(async (value) => {
        const response = await getClientById(value);
        if(response === null) return false;
        return true;
    }).withMessage(validErrMsg("client id")),

]

const validateJobPut = [
    body("desc")
    .optional({ values: "falsy" })
    .notEmpty().withMessage(emptyErrMsg("Description"))
    .escape()
    .isLength({min: 15, max: 500}).withMessage(lengthErrMsg(15, 500)),
    
    body("costCent")
    .optional({ values: "falsy" })
    .notEmpty().withMessage(emptyErrMsg("Cost"))
    .isInt({min: 1}).withMessage(validErrMsg("number"))
    .toInt(),
    
    body("createdAt")
    .optional({ values: "falsy" })
    .notEmpty().withMessage(emptyErrMsg("Created Date"))
    .isISO8601().withMessage(validErrMsg("ISO 8601 date")),
    
    body("doneAt")
    .optional({ values: "falsy" })
    .notEmpty().withMessage(emptyErrMsg("Done Date"))
    .isISO8601().withMessage(validErrMsg("ISO 8601 date"))
    .custom((value, {req}) => {
        return value > req.body.createdAt
    }).withMessage(validErrMsg("date that is past created date")),

    body("progress")
    .optional({ values: "falsy" }).trim()
    .notEmpty().withMessage(emptyErrMsg("Progress"))
    .isAlpha().withMessage(containErrMsg("letters"))
    .custom((value) => {
        return (value === "COMPLETED" || value === "INPROGRESS" || value === "PENDING" || value === "CANCELED" || value === "PAUSED")
    }).withMessage(validErrMsg("progress")),

    body("employeeId")
    .optional({ values: "falsy" })
    .notEmpty().withMessage(emptyErrMsg("Employee"))
    .isInt().withMessage(validErrMsg("number"))
    .toInt()
    .custom(async value => {
        const response = await getEmployeeById(value);
        if(response === null) return false;
        return true;
    }).withMessage(validErrMsg("employee id")),

    body("clientId")
    .optional({ values: "falsy" })
    .notEmpty().withMessage(emptyErrMsg("Client"))
    .isInt().withMessage(validErrMsg("number"))
    .toInt()
    .custom(async (value) => {
        const response = await getClientById(value);
        if(response === null) return false;
        return true;
    }).withMessage(validErrMsg("client id")),

]



module.exports = {
    validateEmployeePost, 
    validateEmployeePut,
    validateClientPost,
    validateClientPut,
    validateJobPost,
    validateJobPut
}