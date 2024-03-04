const mongoose = require('mongoose')
const chatGroup = require('../models/chatGroup')

const groupCltr = {}

groupCltr.createGroup = async (req, res) => {
    try {
        const { body } = req
        const id = req.userId
        console.log('body', body)

        const members = body.members.map(member => member.userId)
        members.push(req.userId)

        const newGroup = new chatGroup({
            name: body.name,
            creator: id,
            members: members,
            messages: []
        })

        const group = await newGroup.save()
        // console.log("GROU" , group)

        //
        req.app.io.emit('newGroup',group)
        //

        res.json(group)
    }
    catch (err) {
        res.json(err)
    }
}

groupCltr.chat = async (req, res) => {
    try {
        const groups = await chatGroup.find()
        // console.log(groups)
        // const id = new mongoose.Types.ObjectId(req.userId)
        // const userGroups = groups.filter((ele) => {
        //     console.log(ele.members.includes(req.userId))
        // })

        const usersGroups = []
        // const id = '64d65f889d95555245baa103'
        groups.forEach((ele) => {
            if (ele.members.includes(req.userId)) {
                usersGroups.push(ele)
            }
        })
        console.log(' chaaat groups, ' , groups)
        res.json(usersGroups)
    }
    catch (e) {
        res.json(e)
    }
}

groupCltr.message = async (req, res) => {
    try {
        const {body} = req
        // console.log('body inside message' , body)
        const chat = await chatGroup.findByIdAndUpdate(body.groupId, {
            $push:{ messages: {sender:body.sender, message : body.message}},
        })
        // console.log(' chat os',chat)
        // res.json(chat)

    }
    catch(e){
        res.json(e)
    }
}

module.exports = groupCltr