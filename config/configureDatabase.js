const mongoose = require('mongoose')


const db = process.env.DATABASE

const configureDB = () => {
    mongoose.connect(db , {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
        .then((res) => {
            console.log('connected to the db')
        })
        .catch((err) => {
            console.log('error connecting to db ')
        })
}

module.exports = configureDB