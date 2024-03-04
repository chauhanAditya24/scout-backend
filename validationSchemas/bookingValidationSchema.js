const {body} = require('express-validator')

const bookingValidationSchema = {}


bookingValidationSchema.book = [
    // body('userId').trim()
    //     .notEmpty()
    //     .withMessage('userId cannot be empty'),
    
    body('groundId').trim()
        .notEmpty()
        .withMessage('ground Id cannot be empty'),
    
    body('managerId').trim()
        .notEmpty()
        .withMessage('manager id cannot be empty'),
    
    body('time').trim()
        .notEmpty()
        .withMessage('time cannot be empty'),
    
    body('date').trim()
        .notEmpty()
        .withMessage('date cannot be empty'),

    body('price').trim()
        .notEmpty()
        .withMessage('price cannot be empty')
        .custom((value) => {
            const num = Number(value)
            if(num <=0){
                throw new Error('price cannot be 0 or less than 0')
            }
            return true
        }),

    body('name').trim()
        .isLength({min:3})
        .withMessage('3 characters minimum required')
        .isLength({max:20})
        .withMessage('20 characters maximum required'),

    body('location').trim()
        .isLength({min:5})
        .withMessage('minimum length is 5')
        .isLength({max:64})
        .withMessage('max 64 characters allowed')
]

bookingValidationSchema.check = [
    body('date').trim()
        .notEmpty()
        .withMessage('date cannot be empty'),

    body('time').trim()
        .notEmpty()
        .withMessage('time cannot be empty'),
    
    body('groundId').trim()
        .notEmpty()
        .withMessage('ground id cannot be empty')
]

module.exports = bookingValidationSchema