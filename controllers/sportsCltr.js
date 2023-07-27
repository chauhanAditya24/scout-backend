const Sport = require('../models/sports')

const sportsCltr = {}

sportsCltr.add = ( req , res ) => {
    const {body} = req
    const sport = new Sport(body)
    sport.save()
        .then((sports) => {
            res.json(sports)
        })
        .catch((err) => {
            res.json(err)
        })
}


sportsCltr.list = ( req , res ) => {
    Sport.find()
        .then((sports) => {
            res.json(sports)
        })
        .catch((err) => {
            res.json(err)
        })
}

module.exports = sportsCltr