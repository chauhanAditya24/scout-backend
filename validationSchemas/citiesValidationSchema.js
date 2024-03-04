const { body } = require('express-validator')

const citiesValidationSchema = [
    body('city').trim().isLength({ min:4 })
        .withMessage('City must atleast have 4 characters')
        .isLength({ max: 22})
        .withMessage('Max 22 characters are allowed')
]

module.exports = citiesValidationSchema