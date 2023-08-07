const Booking = require('../models/booking')

const bookingCltr = {}

bookingCltr.book = async ( req, res ) => {
    try{
        const { body } = req
        const booking = new Booking(body)
        booking.userId = req.userId
        console.log('booking check ' , booking)

        const data = await Booking.find({groundId: body.groundId})
        let flag = false
        console.log('data', data)

        data.forEach((ele) => {
            // console.log('date : ', typeof ele.date , typeof body.date, ele.date ,body.date )
            // console.log('time : ', typeof ele.time , typeof body.time,ele.time, body.time )
            if(ele.time === body.time && ele.date === body.date){
                // console.log('idk but rue some where')
                flag = true
            }
        })

        if(flag){
            res.json({msg: 'not available'})
        }else{
            const databack = await booking.save()
            console.log('databack' , databack)
            res.json(databack)
        }

        
    }
    catch(e){
        res.json(e)
    }
    
}


bookingCltr.check = async( req, res) => {
    try{
        const {body} = req
        console.log(body.time)

        const data = await Booking.find({groundId: body.groundId})
        // console.log(data)


        if(data){
            let flag = false
            data.forEach((ele) => {
                // console.log('date : ', typeof ele.date , typeof body.date, ele.date ,body.date )
                // console.log('time : ', typeof ele.time , typeof body.time,ele.time, body.time )
                if(ele.time === body.time && ele.date === body.date){ 
                    flag = true
                }
            })

            if(flag){
                res.json({msg: 'not available'})
            }else{
                res.json({msg: 'available'})
            }

        }else{
            res.json({msg:'inside else'})
        }

    }catch(err) {
        res.json(err)
    }
    
}


module.exports = bookingCltr