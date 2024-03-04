const { body } = require('express-validator')

const userUpdateSchema = [
    body('username').trim().isLength({ min: 3 })
        .withMessage('username should have minimum 3 characters')
        .isLength({ max: 16 })
        .withMessage('Max characters allowed are 16'),

    body('email').trim().isEmail()
        .withMessage('Invalid Email'),

    body('phone').trim()
        .isMobilePhone()
        .withMessage('invalid mobile phone number')
        .isLength({min:10,max:10})
        .withMessage('10 digits required'),

    // body('password').trim()
    //     .isLength({ min: 6 })
    //     .withMessage('minimum lenght is 6')
    //     .isLength({max:128})
    //     .withMessage('max length is 128'),
    
    body('city').trim()
        .isLength({min:4})
        .withMessage('minimum 4 character required')
        .isLength({max:28})
        .withMessage('max 28 characters required'),

    body('sport').trim()
        .isLength({min: 4})
        .withMessage('minimum characters are 4')
        .isLength({max:20})
        .withMessage('max 20 characters are allowed'),

    body('role').trim()
        .notEmpty()
        .withMessage('role is required')
        .isIn(['player','manager'])
        .withMessage('Role must be either player or manager'),

    body('bio').trim()
        .isLength({min:5})
        .withMessage('minimum characters should be 5')
        .isLength({max:100})
        .withMessage('max 100 characters allowed'),

]

module.exports = userUpdateSchema