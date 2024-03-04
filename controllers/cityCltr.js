const City = require('../models/cities')
const { validationResult } = require('express-validator')

const citiesCltr = {}

citiesCltr.add = (req, res) => {

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        res.json({ errors: errors.array() })
    } else {
        const { body } = req
        const city = new City(body)
        city.save()
            .then((city) => {
                res.json(city)
            })
            .catch((err) => {
                res.json(err)
            })
    }
}

citiesCltr.list = (req, res) => {
    City.find()
        .then((cities) => {
            res.json(cities)
        })
        .catch((err) => {
            res.json(err)
        })
}

module.exports = citiesCltr