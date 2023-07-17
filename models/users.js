const mongoose = require('mongoose')
const Schema = mongoose.Schema

const usersSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        required: true,
        unique: true,
        type: String,
        minlength: 10,
        maxlength: 10
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 32
    },
    role: {
        type: String,
        default: 'player'
    }
})

const User = mongoose.model('User', usersSchema)

module.exports = User