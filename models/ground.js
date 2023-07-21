const mongoose = require('mongoose')
const Schema = mongoose.Schema

const groundSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true,
        min: 1
    },
    timings: {
        type: String,
        required: true
    }

    //need to have a reference of the owner/user

})

const Ground = mongoose.model('Ground', groundSchema)

module.exports = Ground
