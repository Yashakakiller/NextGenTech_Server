const { body } = require("express-validator")


const validation = [
    body("email","Please Enter a valid email").isEmail(),
    body('password',"For Security Concerns please enter a minimum 8 digit password").isLength({ min: 8 })
]

const loginValidation = [
    body("email","Please Enter a valid email format").isEmail(),
]

module.exports = {
    validation ,
    loginValidation
}