const mongoose = require('mongoose')
const Schema = mongoose.Schema

const sportsSchema = new Schema({
    name:{
        type: String,
        unique:true,
        required: true
    }
})

const Sport = mongoose.model('sports_scout' , sportsSchema)

module.exports = Sport