const mongoose = require('mongoose')
const Schema = mongoose.Schema

const citySchema = new Schema({
    city:{
        type:String,
        unique: true,
        required: true
    }
})

const City = mongoose.model('City', citySchema)

module.exports = City