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
        minlength: 1
    },
    sport:{
        type: String,
        required:true
    },
    timings: {
        type: String,
        required: true
    },
    slotType:{
        type:String,
        required: true,
        minlength:1,
        maxlength:3
    },
    userId:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    capacity:{
        type:String,
        required:true,
        minlength:1,
        maxlength:30
    }
    //need to have a reference of the owner/user
})

const Ground = mongoose.model('Ground', groundSchema)

module.exports = Ground
