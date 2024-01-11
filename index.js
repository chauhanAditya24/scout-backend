const express = require('express')
const multer = require('multer')
const cors = require('cors')
require('dotenv').config()
const configureDB = require('./config/configureDatabase')
const router = require('./config/routes')
const User = require('./models/users')
const app = express()
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
const port = 3088

app.listen( port , () => {
    console.log('server running on port: ', port)
})