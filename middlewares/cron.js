const cron = require('node-cron')
const Users = require('../models/users')
const Booking = require('../models/booking')
const nodemailer = require('nodemailer')

const nodeCron = () => {

    cron.schedule('0 23 * * *', async () => {
        console.log('task running every minute')
        //current date
        const date = new Date()
        const nextDate = new Date(date)
        nextDate.setDate(date.getDate() + 1)

        const checkDate = nextDate.toISOString().split('T')[0].split('-').reverse().join('-')
        // let reminderBookings
        try {
            const booking = await Booking.find()
            // console.log('booking inside try block' , booking)
            const reminderBookings = booking.filter((ele) => {
                // console.log('ele.date' , ele.date, 'check date', checkDate, ele.date === checkDate)
                return ele.date === checkDate
            })

            console.log('reminderBookings', reminderBookings)

            //mail for manager
            const managerMailPromise = reminderBookings.map(async (booking) => {
                try {
                    const user = await Users.findById(booking.managerId)
                    console.log('search by specific mail', user)
                    return user.email
                }
                catch (err) {
                    console.log('error by fetching user by ID', err)
                    return null
                }
            })

            const managerMailList = await Promise.all(managerMailPromise)

            // mail for users
            const userMailPromise = reminderBookings.map(async (booking) => {
                try {
                    const user = await Users.findById(booking.userId)
                    console.log('search by specific mail', user)
                    return user.email
                }
                catch (err) {
                    console.log('error by fetching user by ID', err)
                    return null
                }
            })

            const userMailList = await Promise.all(userMailPromise)




            // console.log('user mail list promise vala',userMailList)

            // const userMailList = ['adityachauhan2408@gmail.com']

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                host: 'smtp.gmail.com',
                auth: {
                    user: 'scoutofficial24@gmail.com',
                    pass: 'kqoa pinl bgrh uglb'
                },
            })


            const userMailInfo = await transporter.sendMail({
                from: '"Scout Official 👻" <scoutofficial24@gmail.com>', // sender address
                to: userMailList.filter(Boolean), // list of receivers
                subject: "Reminder", // Subject line
                text: "Reminder for your booking tomorrow", // plain text body
                html: "<b>Reminder for your booking tomorrow.</b>", // html body
            });

            const managerMailInfo = await transporter.sendMail({
                from: '"Scout Official 👻" <scoutofficial24@gmail.com>', // sender address
                to: managerMailList.filter(Boolean), // list of receivers
                subject: "Reminder", // Subject line
                text: "Your turf is booked for tomorrow. Please login to our app to see the bookings", // plain text body
                html: "<b>Your turf is booked for tomorrow. Please login to our app to see the bookings</b>", // html body
            });
            console.log('mail send successfully')
        }
        catch (err) {
            console.log(err)
        }

    })

}

module.exports = nodeCron