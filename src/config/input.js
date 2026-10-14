const { body } = require("express-validator")

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


module.exports = {
    validateEmployeePost, 
    validateClientPost
}