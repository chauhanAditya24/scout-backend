const mongoose = require('mongoose')
const Schema = mongoose.Schema

const citySchema = new Schema({
    city:{
        type:String,
        unique: true,
        required: ['city name is required' , true],
        minlength:4,
        maxlength:22
    }
})

const City = mongoose.model('city_scout', citySchema)

module.exports = City