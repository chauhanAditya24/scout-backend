const Sport = require('../models/sports')
const { validationResult } = require('express-validator')

const sportsCltr = {}

sportsCltr.add = (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        res.json({ errors: errors.array() })
    } else {
        const { body } = req
        console.log('body in sports', body)

        const sport = new Sport(body)
        sport.save()
            .then((sports) => {
                res.json(sports)
            })
            .catch((err) => {
                res.json(err)
            })
    }

}


sportsCltr.list = (req, res) => {
    Sport.find()
        .then((sports) => {
            res.json(sports)
        })
        .catch((err) => {
            res.json(err)
        })
}

module.exports = sportsCltr