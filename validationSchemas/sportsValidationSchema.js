const { body } = require('express-validator')

const sportsValidationSchema = [
    body('name').trim()
        // .notEmpty()
        // .withMessage('name cannot be empty')
        .isLength({ min: 4 })
        .withMessage('A sports name atleat have 4 characters.')
        .isLength({ max: 20 })
        .withMessage('Max 20 characters are allowed')

]

module.exports = sportsValidationSchema