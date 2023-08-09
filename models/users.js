const mongoose = require('mongoose')
const validator = require('validator')

const Schema = mongoose.Schema

const usersSchema = new Schema({
    username: {
        type: String,
        required: ['name is required for login',true],
        minlength: 4,
        maxlength: 64,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate:{
            validator: function (value) {
                return validator.isEmail(value)
            },
            message: function () {
                return 'invalid email format'
            }
        }
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
        maxlength: 128
    },
<<<<<<< HEAD
    profilePicture:{
        required: true,
        type: String
    },
=======
>>>>>>> 811f622036d96024f7ec0c8ab02497d33664470e
    city:{
        required: true,
        type: String
    },
    sport: {
        required: true,
        type: String
    },
    role: {
        type: String,
        required: true
    }
})

const User = mongoose.model('User', usersSchema)

module.exports = User