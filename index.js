const express = require('express')
const app = express()
const multer = require('multer')
const cors = require('cors')
require('dotenv').config()
const configureDB = require('./config/configureDatabase')
const router = require('./config/routes')
const User = require('./models/users')
const path = require('path')
const nodeCron = require('./middlewares/cron')
// const usersCltr = require('./controllers/usersCltr')

app.use(cors())
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

//connecting to database
configureDB()

// running cron job
nodeCron()

//using routes
app.use(router)

const PORT = process.env.PORT || 3088

const server = app.listen(PORT, () => {
    console.log('server running on port: ', PORT)
})

// updating cors here 
//origin: 'http://localhost:3000'
const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {
        origin: 'https://scouttt.netlify.app'
    }
})

io.on('connection', (socket) => {
    console.log('connected to socket.io')

    socket.on('setup', (userData) => {
        socket.join(userData._id)
        console.log('userData', userData._id)
        socket.emit('connected')
    })

    socket.on('join chat', (room) => {
        socket.join(room)
        console.log('User joined room', room)
    })

    socket.on('new message', (newMessageRecieved) => {
        const chat = newMessageRecieved.chat
        // console.log('new Message Recieved Object', newMessageRecieved)
        // console.log('!chat.users',!chat.users)
        if (!chat.users) {
            return console.log('chat.users not defined')
        }

        chat.users.forEach((ele) => {
            console.log('ele id', ele)
            if (ele._id === newMessageRecieved.sender._id) return

            socket.in(ele._id).emit('message recieved', newMessageRecieved)
        })

    })

    socket.off('setup', () => {
        console.log('USER DISCONNECTED')
        socket.leave(userData._id)
    })

})