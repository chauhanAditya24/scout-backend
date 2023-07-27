const mongoose = require('mongoose')
const Schema = mongoose.Schema

const sportsSchema = new Schema({
    name:{
        type: String,
        unique:true,
        required: true
    }
})

const Sport = mongoose.model('Sport' , sportsSchema)

module.exports = Sport