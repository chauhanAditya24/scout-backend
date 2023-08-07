const express = require('express')
const cors = require('cors')
require('dotenv').config()
const configureDB = require('./config/configureDatabase')
const router = require('./config/routes')
const app = express()

app.use(express.json())
app.use(cors())


//connecting to database
const db = configureDB()
// db.once('open', () => {
//     // Init stream
//     gfs = Grid(conn.db, mongoose.mongo);
//     gfs.collection('uploads');
//   });



  

//using routes
app.use(router)
const port = 3088

app.listen( port , () => {
    console.log('server running on port: ', port)
})