const mongoose = require('mongoose')
const Schema = mongoose.Schema

const citySchema = new Schema({
    city:{
        type:String,
        unique: true,
        required: true
    }
})

const City = mongoose.model('city_scout', citySchema)

module.exports = City