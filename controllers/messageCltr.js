const Chat = require('../models/chat')
const Message = require('../models/message')
const User = require('../models/users')

const messageCltr = {}

messageCltr.sendMessage = async (req, res) => {
    const { content, chatId } = req.body
    // console.log('content and chatID', content,chatId)
    if(!content || !chatId){
        // console.log('invalid data passed into the request')
        res.json('invalid data')
    }
    
    const newMessage = {
        sender:req.userId,
        content:content,
        chat:chatId
    }

    try{
        let message = await Message.create(newMessage)

        message = await message.populate('sender','username profilePicture')
        message = await message.populate('chat')
        message = await User.populate(message , {
            path:'chat.users',
            select:'username profilePicture email'
        })

        await Chat.findByIdAndUpdate(req.body.chatId,{
            latestMessage:message,
        })

        res.json(message)

    }
    catch(err){
        // throw new Error(err.message)
        res.json(err)
    }

}

messageCltr.allMessages = async(req,res) => {

    // console.log("CHAT ID'S : ", req.params.chatId)

    try {
        const message = await Message.find({chat: req.params.chatId})
        .populate('sender','username profilePicture emial')
        .populate('chat')
        // console.log('Message' , message)
        res.json(message)
    } catch (err) {
        res.json(err.message)
        // throw new Error(err.message)
    }
}

module.exports = messageCltr