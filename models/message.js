const mongoose = require('mongoose')

const Schema = mongoose.Schema

const messageSchema = new Schema({
    content: {
        type: String,
        trim: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat'
    }
},
    {
        timestamps: true
    }
)

const Message = mongoose.model('Message',messageSchema)

module.exports = Message