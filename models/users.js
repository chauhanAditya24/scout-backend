const mongoose = require('mongoose')
const validator = require('validator')

const Schema = mongoose.Schema

const usersSchema = new Schema({
    username: {
        type: String
    },
    email: {
        type: String
    },
    phone: {
        type: String
    },
    password: {
        type: String
    },
    profilePicture: {
        type: String
    },
    city: {
        type: String
    },
    role: {
        type: String
    },
    bio: {
        type: String
    },
    followers: {
        type: Array
    }
})


// const usersSchema = new Schema({
//     username: {
//         type: String,
//         required: ['name is required for login',true],
//         minlength: 4,
//         maxlength: 64,
//         unique: true
//     },
//     email: {
//         type: String,
//         required: true,
//         unique: true,
//         validate:{
//             validator: function (value) {
//                 return validator.isEmail(value)
//             },
//             message: function () {
//                 return 'invalid email format'
//             }
//         }
//     },
//     phone: {
//         required: true,
//         unique: true,
//         type: String,
//         minlength: 10,
//         maxlength: 10
//     },
//     password: {
//         type: String,
//         required: true,
//         minlength: 8,
//         maxlength: 128
//     },
//     profilePicture:{
//         required: true,
//         type: String
//     },
//     city:{
//         required: true,
//         type: String
//     },
//     sport: {
//         required: true,
//         type: String
//     },
//     role: {
//         type: String,
//         required: true
//     },
//     bio:{
//         required: true,
//         minlength:5,
//         maxlength:100,
//         type: String
//     },
//     followers :{
//         type: Array
//     }
// })

const User = mongoose.model('User', usersSchema)

module.exports = User