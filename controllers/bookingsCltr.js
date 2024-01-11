const Booking = require('../models/booking')

const dateToday = () => {

    let today = new Date()
    let dd = today.getDate()
    let mm = today.getMonth() + 1
    let yyyy = today.getFullYear()

    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    today = dd + '-' + mm + '-' + yyyy;

    return today
}

const bookingCltr = {}

bookingCltr.sessionTest = (req,res) => {
    console.log('----------session test ------------',req.body)
}

bookingCltr.book = async (req, res) => {
    try {
        const { body } = req
        // console.log('bodyyyyyyyy',req.tempBooking)
        const booking = new Booking(body)
        booking.userId = req.userId
        console.log('booking check ', booking)

        const data = await Booking.find({ groundId: body.groundId })
        let flag = false
        // console.log('data', data)

        data.forEach((ele) => {
            // console.log('date : ', typeof ele.date , typeof body.date, ele.date ,body.date )
            // consol`e.log('time : ', typeof ele.time , typeof body.time,ele.time, body.time )
            if (ele.time === body.time && ele.date === body.date) {
                // console.log('idk but rue some where')
                flag = true
            }
        })

        if (flag) {
            res.json({ msg: 'not available' })
        } else {
            const databack = await booking.save()
            console.log('databack', databack)
            res.json(databack)
        }


    }
    catch (e) {
        res.json(e)
    }

}


bookingCltr.check = async (req, res) => {
    try {
        const { body } = req
        console.log('body ', body)

        const startTime2 = body.time.split('-')[0]
        const endTime2 = body.time.split('-')[1]

        const data = await Booking.find({ groundId: body.groundId })
        console.log(' time 2 ', data)

        // const startTime1 = data.time.split('-')[0]
        // const endTime1 = data.time.split('-')[1]

        if (data) {
            let flag = false
            data.forEach((ele) => {
                // console.log('date : ', typeof ele.date , typeof body.date, ele.date ,body.date )
                // console.log('time : ', typeof ele.time , typeof body.time,ele.time, body.time )
                // if (ele.time === body.time && ele.date === body.date) {
                //     flag = true
                // }

                if (ele.date === body.date) {

                    const startTime1 = ele.time.split('-')[0]
                    const endTime1 = ele.time.split('-')[1]         
                               
                    if ((startTime1 === startTime2 && endTime1 === endTime2) || (startTime1 > startTime2 && endTime1 === endTime2) || (startTime1 === startTime2 && endTime1 < endTime2) || (startTime2 > startTime1 && startTime2 < endTime1) || (startTime1 > startTime2 && endTime1 < endTime2) || (startTime1 < endTime2 && endTime1 > endTime2)) {
                        // console.log('slot is not avaiable')
                        flag = true
                    } //else {
                        //console.log('slot is avaiable')
                    //}
                }
            })

            if (flag) {
                res.json({ msg: 'not available' })
            } else {
                res.json({ msg: 'available' })
            }

        } else {
            res.json({ msg: 'inside else' })
        }

    } catch (err) {
        res.json(err)
    }

}

bookingCltr.list = async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.userId })
        console.log(bookings.length)
        if (bookings.length > 0) {
            const ans = dateToday()
            console.log('date : ', ans)
            console.log('date 2', bookings[0].date)
            const result = bookings.filter((booking) => {
                return booking.date === ans || booking.date > ans
            })
            res.json(result)
        }
        else {
            res.json({ msg: 'no booking done' })
        }
    }
    catch (err) {
        res.json(err)
    }
}

bookingCltr.managerList = async (req, res) => {
    try {
        // console.log(' user id',req.userId)
        const bookings = await Booking.find({ managerId: req.userId })
        if (bookings.length > 0) {
            const ans = dateToday()
            console.log('date : ', ans)
            console.log('date 2', bookings[0].date)
            const result = bookings.filter((booking) => {
                return booking.date === ans || booking.date > ans
            })
            res.json(result)
        }   
        else {
            res.json({ msg: 'no booking done' })
        }
    }
    catch (err) {
        res.json(err)
    }
}

bookingCltr.cancel = async (req, res) => {
    try {
        const { id } = req.params
        const bookings = await Booking.findByIdAndDelete({ _id: id })
        res.json(bookings)
    }
    catch (err) {
        res.json(err)
    }
}

module.exports = bookingCltr