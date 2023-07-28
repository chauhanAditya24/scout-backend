const Ground = require('../models/ground')

const groundsCltr = {}

groundsCltr.list = ( req , res ) => {
    Ground.find()
        .then((ground) => {
            res.json(ground)
        })
        .catch((err) => {
            res.josn(err)
        })
}

groundsCltr.register = ( req, res ) => {
    const {body} = req
    const grounds = new Ground(body)
    grounds.save()
        .then((ground) => {
            res.json(ground)
        })
        .catch((err) => {
            res.json(err)
        })
}

groundsCltr.selectedGround = ( req , res ) => {
    const id = req.params.id
    Ground.findById(id)
        .then((ground) => {
            res.json(ground)
        })
        .catch((err) => {
            res.json(err)
        })
} 

groundsCltr.search = ( req , res) => {
    const {body} = req
    console.log(body)
    Ground.find({city: body.city, sport: body.sport})
        .then((grounds) => {
            res.json(grounds)
        })
        .catch((err) => {
            res.json(err)
        })
}

groundsCltr.delete = ( req, res) => {
    const id = req.params.id
    Ground.findByIdAndDelete(id)
        .then((ground) => {
            res.json(ground)
        })
        .catch((err) => {
            res.json(err)
        })
}

groundsCltr.show = ( req, res) => {
    const {id} = req.params
    Ground.findById(id)
        .then((ground) => {
            res.json(ground)
        })
        .catch((err) => {
            console.log(err)
        })
}

groundsCltr.update = ( req, res) => {
    const id =req.params.id
    const body = req.body
    Ground.findByIdAndUpdate(id, body, {new: true, runValidators: true})
        .then((ground) => {
            res.json(ground)
        })
        .catch((err) => {
            res.json(err)
        })
}

module.exports = groundsCltr