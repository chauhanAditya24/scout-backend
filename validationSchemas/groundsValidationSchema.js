const {body} = require('express-validator')

const groundsValidationSchema = [
    body('name').trim()
        .isLength({min:3})
        .withMessage('name should have atleast 3 characters')
        .isLength({max:32})
        .withMessage('Max 32 characters allowed'),

    body('location').trim()
        .isLength({min:4})
        .withMessage('Min 4 character required')
        .isLength({max:128})
        .withMessage('Max 128 characters allowed'),
    
    body('city').trim()
        .isLength({min:4})
        .withMessage('Should have minimum 4 characters')
        .isLength({max:22})
        .withMessage('Max 20 characters allowed'),

    body('price').trim()
        .custom((value ,{req}) => {
            const num = Number(value)
            if(num == 0 || num < 0){
                throw new Error("price cannot be 0 or less than 0")
            }
            return true
        }),

    body('sport').trim()
        .isLength({min: 4})
        .withMessage('minimum 4 characters required')
        .isLength({max:16})
        .withMessage('maximum 20 characters allowed'),

    body('timings').trim()
        .notEmpty()
        .withMessage('timings cannot be empty'),

    body('slotType').trim()
        .custom((value) => {
            const num = Number(value)
            if(num < 1){
                throw new Error('Slot cannot be 0 or -ve')
            }
            return true
        }),

    body('userId').notEmpty()
        .withMessage('user id cannot be empty'),

    body('capacity').trim()
        .custom((value) => {
            const num = Number(value)
            if(num < 2){
                throw new Error('atleast require 2 players')
            }
            return true
        }),

]


module.exports = groundsValidationSchema