const City = require('../models/cities')

const citiesCltr = {}

citiesCltr.test = (req,res) =>{
    res.json({msg: 'messgage new'})
}


citiesCltr.add = ( req , res) => {
    const  { body } = req
    console.log('body',body)
    const city = new City(body)
    console.log('city' , city)
    city.save()
        .then((city) => {
            res.json(city)
        })
        .catch((err) => {
            res.json(err)
        })
}

citiesCltr.list = ( req , res ) => {
    // console.log('inside the city')
    City.find()
        .then((cities) => {
            console.log('city' , cities)
            res.json(cities)
        })
        .catch((err) => {
            res.json(err)
        })
} 

module.exports = citiesCltr