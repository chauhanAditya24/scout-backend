const mongoose = require('mongoose')
const Schema = mongoose.Schema


// const sportsSchema = new Schema({
//     name:{
//         type:String
//     },
// })

const sportsSchema = new Schema({
    name:{
        type: String,
        unique:true,
        required: ['name is required',true],
        minlength:4,
        maxlength:20
    }
})

const Sport = mongoose.model('sports_scout' , sportsSchema)

module.exports = Sport