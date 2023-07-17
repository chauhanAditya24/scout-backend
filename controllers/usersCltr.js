const User = require('../models/users')

usersCltr = {}

//listing all the users
usersCltr.list = ( req, res) => {
    User.find()
        .then((user) => {
            res.json(user)
        })
        .catch((err) => {
            res.json(err)
        })
}

usersCltr.register = ( req, res ) => {
    const {body} = req
    const user = new User(body)
    user.save()
        .then((user) => {
            res.json(user)
        })
        .catch((err) => {
            res.json(err)
        })
}

usersCltr.delete = ( req, res) => {
    const {id} = req.params
    User.findByIdAndDelete(id)
        .then((user) => {
            res.json(user)
        })
        .catch((err) => {
            res.json(err)
        })
}

usersCltr.update = ( req, res) => {
    const id = req.params.id
    const body = req.body
    User.findByIdAndUpdate( id, body, { new: true, runValidators: true})
        .then((user) => {
            res.json(user)
        })
        .catch((err) => {
            res.json(err)
        })
}

usersCltr.show = ( req, res) => {
    const {id} = req.params
    User.findById(id)
        .then((user) => {
            res.json(user)
        })
        .catch((err) => {
            res.json(err)
        })
}

module.exports = usersCltr