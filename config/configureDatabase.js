const mongoose = require('mongoose')

const configureDB = () => {
    mongoose.connect('mongodb://localhost:27017/the-scout-project' , {
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