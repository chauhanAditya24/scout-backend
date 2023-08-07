const mongoose = require('mongoose')
const Schema = mongoose.Schema

const bookingSchema = new Schema({
    userId:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    groundId:{
        type: Schema.Types.ObjectId,
        ref: 'Ground'
    },
    time: {
        type: String,
        required: true
    },
    date:{
        type:String,
        required:true
    }
},{timestamps:true})

const Booking = mongoose.model('Booking' , bookingSchema)

module.exports = Booking