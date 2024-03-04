const Chat = require('../models/chat')
const User = require('../models/users')

const chatCltr = {}

chatCltr.usersChat = async (req, res) => {
    try{
        const chats = await Chat.find()
        const usersChats = chats.filter((ele) => {
            return ele.users.includes(req.userId)
        })
        // console.log('users chat',usersChats)
        res.json(usersChats)
    }
    catch(err){
        res.json(err)
    }
}

chatCltr.accessChat = async (req, res) => {
    try {

        const { userid } = req.body
        let isChat = await Chat.find({
            isGroupChat: false,
            $and: [
                { users: { $elemMatch: { $eq: req.userId } } },
                { users: { $elemMatch: { $eq: userid } } }
            ]
        }).populate('users', '-password').populate('latestMessage')

        ischat = await User.populate(isChat, {
            path: 'latestMessage.sender',
            select: 'username email profilePicture'
        })

        if (isChat.length > 0) {
            res.json(isChat[0])
        } else {
            let chatData = {
                chatName: 'Sender',
                isGroupChat: false,
                users: [req.userId, userid]
            }


            try {
                const createdChat = await Chat.create(chatData)

                const fullChat = await Chat.findOne({ _id: createdChat._id }).populate('users', '-password')
                res.json(fullChat)
            }
            catch (e) {
                res.json(e)
            }


        }
    }
    catch (e) {
        res.jons(e)
    }
}

chatCltr.fetchChats = async (req, res) => {
    try {
        Chat.find({ users: { $elemMatch: { $eq: req.userId } } })
            .populate('users', '-password')
            .populate('groupAdmin', '-password')
            .populate('latestMessage')
            .sort({ updatedAt: -1 })
            .then(async (result) => {
                const results = await User.populate(result, {
                    path: 'latestMessage.sender',
                    select: 'name pic email'
                })
                res.json(results)
            })
    }
    catch (e) {
        res.json(e)
    }
}

chatCltr.createGroupChat = async (req, res) => {
    try {
        const { users } = req.body
        // console.log('body' , req.body)
        // console.log('body arr' , users)
        // console.log('req.userID', req.userId)
        // console.log('users chat: ', users)
        users.push(req.userId)

        // res.json(users)
        // res.json(users)
        if (users.length < 2) {
            res.json('More than two users are required to form a group')
        }

        // console.log('users chat ewn: ', users)
        const groupChat = await Chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.userId
        })

        // console.log('group chat',groupChat)
        const fullGroupChat = await Chat.findOne({
            _id: groupChat._id
        })
            .populate('users', '-password')
            .populate('groupAdmin', '-password')

        // console.log('users chatafter: ', fullGroupChat)
        
        res.json(fullGroupChat)
    }
    catch (e) {
        res.json(e)
    }
}

chatCltr.renameChat = async (req, res) => {
    const { chatId, name } = req.body
    // console.log(req.body)
    const updatedChat = await Chat.findByIdAndUpdate(chatId, {
        chatName: name
    }, {
        new: true
    })
        .populate('users', '-password')
        .populate('groupAdmin', '-password')

    // res.json(updatedChat)
    if (!updatedChat) {
        throw new Error('chat not found')
    } else {
        res.json(updatedChat)
    }

}

chatCltr.addMember = async (req, res) => {
    try {
        const { chatId, userId } = req.body
        const added = await Chat.findByIdAndUpdate(chatId, {
            $push: { users: userId }
        }, {
            new: true
        })
            .populate('users', '-password')
            .populate('groupAdmin', '-password')

        if (!added) {
            throw new Error('chat not found')
        } else {
            res.json(added)
        }
    }
    catch (er) {
        res.json(er)
    }
}

chatCltr.removeMember = async (req, res) => {
    try {
        const { chatId, userId } = req.body
        const removed = await Chat.findByIdAndUpdate(chatId, {
            $pull: { users: userId }
        }, {
            new: true
        })
            .populate('users','-password')
            .populate('groupAdmin','-password')

        if(!removed){
            throw new Error('chat not found')
        }else{
            res.json(removed)
        }
    }
    catch (err) {
        res.json(err)
    }
}

module.exports = chatCltr