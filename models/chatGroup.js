const mongoose = require('mongoose')

const Schema = mongoose.Schema

const chatGroupSchema = new Schema({
    name: { type: String, required: true },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    // members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    members: [{type:String}],
    messages: [
      {
        sender: {type:String},
        message: {type: String},
        timestamp: { type: Date, default: Date.now },
      },
    ]
    // messages: [
    //   {
    //     sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    //     message: String,
    //     timestamp: { type: Date, default: Date.now },
    //   },
    // ],
  })

const chatGroup = mongoose.model('chatGroup',chatGroupSchema)

module.exports = chatGroup