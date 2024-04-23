const mongoose = require('mongoose')
const User = require('../models/users')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Ground = require('../models/ground')
const Booking = require('../models/booking')
const { validationResult } = require('express-validator')
const cloudinary = require('cloudinary').v2
// const stripe = require('stripe')('sk_test_51OPQrWSCsP2MbOhTp6SxnDg2GiBkkiglV1UidggfOhk4J6m84YlNH5ddsNGh5rCj4XMjZ5M0d1RBnqTu3KQ5z8GV001NXhKA6c',{
//     apiVersion : '2023-08-16'
// })
const stripe = require('stripe')('sk_test_51OPQrWSCsP2MbOhTp6SxnDg2GiBkkiglV1UidggfOhk4J6m84YlNH5ddsNGh5rCj4XMjZ5M0d1RBnqTu3KQ5z8GV001NXhKA6c', {
    apiVersion: '2022-08-01'
})

const nodemailer = require('nodemailer')

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

usersCltr = {}

// usersCltr.webhooks = async (req,res) => {
//     try{

//     }
//     catch(err){
//         res.json(err)
//     }
// }

//nodemailer

usersCltr.mail = async (req, res) => {
    try {
        // const user = await User.findById(req.userId)
        // console.log('***** MAIL *****')
        // console.log(user)

        // const email = user.email

        // ethreal email temp 
        // const transporter = nodemailer.createTransport({
        //     host: 'smtp.ethereal.email',
        //     port: 587,
        //     auth: {
        //         user: 'ned52@ethereal.email',
        //         pass: '1drKmg7NGErVugcJWD'
        //     }
        // });

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS
            },
        })

        // console.log('transporter' , transporter)

        // const mail = {
        //         from: '"Scout Official 👻" <scoutofficial24@gmail.com>', // sender address
        //         to: "adityachauhan2408@gmail.com", // list of receivers
        //         subject: "Booking", // Subject line
        //         text: "Your booking is confirmed.", // plain text body
        //         html: "<b>Your booking is confirmed.</b>", // html body
        //       }

        // const sendMail = async(transporter,mail) => {
        //     try{
        //         await transporter.sendMail(mail)
        //         console.log('mail has been sent successfully')
        //     }
        //     catch(e){
        //         console.log(e)
        //     }
        // }

        const info = await transporter.sendMail({
            from: '"Scout Official 👻" <scoutofficial24@gmail.com>', // sender address
            to: "adityachauhan2408@gmail.com", // list of receivers
            subject: "Booking", // Subject line
            text: "Your booking is confirmed.", // plain text body
            html: "<b>Your booking is confirmed.</b>", // html body
        });

        //   console.log('info' , info)

        res.json(info)
    }
    catch (err) {
        res.json(err)
    }
}

//payment gateway
usersCltr.payment = async (req, res) => {
    // console.log('payment gateway', req.body)
    try {
        const booking = req.body
        // const usern = await User.findById(req.userId)
        // console.log(' userName to find' , req.userId)
        const lineItems = [booking].map((ele) => ({
            price_data: {
                currency: 'inr',
                product_data: {
                    name: ele.name
                },
                unit_amount: ele.price * 100
            },
            // price:ele.price,
            quantity: 1,
            // description:ele.time
        }))

        const isINR = lineItems[0].price_data.currency.toLowerCase() === 'inr'

        // const lineItems = [
        //     {
        //         name:`${booking.name}`,
        //         description:`Time - ${booking.time} , Date - ${booking.date}  `,
        //         amount:`${Number(booking.price)}`,
        //         currency:'inr',
        //     }
        // ]

        // const tokenData = req.body
        // const token = jwt.sign(tokenData, process.env.JWT_SECRET)

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: 'https://scouttt.netlify.app/payment/success',
            cancel_url: 'https://scouttt.netlify.app/payment/cancel',
            // success_url: 'http://localhost:3000/payment/success',
            // cancel_url: 'http://localhost:3000/payment/cancel',
            // customer_email: 'testuser2@gmail.com',
            // billing_address_collection:'required',
            billing_address_collection: isINR ? 'required' : 'auto',
            shipping_address_collection: {
                allowed_countries: []
            },


            //adding meta data to retrive
            // metadata: {
            //     bookingData: JSON.stringify(booking)
            // },


            // shipping_address_collection: {
            //     allowed_countries: isINR ? [] : [], // Set allowed countries based on the currency
            // }
        })
        // console.log('session object', session)
        res.json({ id: session.id })
    }
    catch (err) {
        // console.log('error creating the checkout session', error)
        res.json({ error: 'failed to create checkout session' })
    }
}

//
// Endpoint to retrieve booking data using the session ID




//

// listing all the users
usersCltr.list = (req, res) => {
    // const errors = validationResult(req)

    User.find()
        .then((users) => {

            const newUsers = users.filter((user) => {
                return user._id.toString() !== req.userId
            })

            res.json(newUsers)

        })
        .catch((err) => {
            res.json(err)
        })
}

//following a person
usersCltr.listFollowing = async (req, res) => {
    try {
        const user = await User.findById(req.userId)
        // conosle.log(' user to find ')
        res.json(user.following)
        // res.json(user)
    }
    catch (err) {
        res.jso(err)
    }
}

usersCltr.addFollowing = async (req, res) => {
    try {
        const data = req.body
        console.log('addd following ', data)
        const user = await User.findById(req.userId)
        const isAlreadyInList = user.following.some((ele) => {
            return ele.id === data.id
        })
        if (isAlreadyInList) {
            res.json({ message: 'user already there' })
        } else {

            const updatedFollowing = [...user.following, data]
            const updatedUser = await User.findByIdAndUpdate(req.userId, { following: updatedFollowing }, { new: true, runValidators: true })
            res.json(updatedUser.following)
        }
    }
    catch (err) {
        res.json(err)
    }
}

usersCltr.removeFollowing = async (req, res) => {
    try {
        const data = req.body
        const user = await User.findById(req.userId)
        // res.json(user.following)
        const updatedFollowing = user.following.filter((ele) => {
            return ele.id !== data.idToRemove
        })

        const updatedUser = await User.findByIdAndUpdate(req.userId, { following: updatedFollowing }, { new: true, runValidators: true })
        // res.json(updatedUser.following)
        res.json({ message: 'success', updatedFollowing: updatedUser.following })

    }
    catch (err) {
        res.json(err)
    }
}


usersCltr.listFollowers = (req, res) => {
    // console.log('req.userId' , req.userId)
    User.findById(req.userId)
        .then((user) => {
            // const data = res
            // console.log('current users data', user)
            res.json(user.followers)
            // console.log('followers : ', data)
            // res.json({followers:data})
            // res.json('end')
            // res.json()
            // res.json({msg:'error'})
        })
        .catch((err) => {
            res.json(err)
        })
}

//new handle users followers

usersCltr.followers = async (req, res) => {
    try {
        const data = req.body
        const currUser = await User.findById(req.userId)
        const name = { id: req.userId, username: currUser.username }

        const user = await User.findById(data.id)
        const isAlreadyFollowing = user.followers.some((follower) => {
            return follower.id === name.id
        })

        if (isAlreadyFollowing) {
            res.json({ message: 'Already folloing' })
        } else {
            const updatedFollowers = [...user.followers, name]
            const updatedUser = await User.findByIdAndUpdate(data.id, { followers: updatedFollowers }, { new: true, runValidators: true })
            // console.log(' updated followers to check ------------------> ', updatedUser.followers)
            res.json({ message: 'success' })
        }
    }
    catch (e) {
        res.json(e)
    }
}

usersCltr.removeFollowers = async (req, res) => {
    try {
        const body = req.body;
        const user = await User.findById(req.userId);
        console.log('users followers:', user.followers);

        // Filter out the follower to remove
        const updatedFollowers = user.followers.filter((follower) => follower.id !== body.idToRemove);
        console.log('updated followers:', updatedFollowers);

        // Update the user with the new followers list
        const updatedUser = await User.findByIdAndUpdate(req.userId, { followers: updatedFollowers }, { new: true, runValidators: true });

        console.log('updatedUser:', updatedUser);

        res.json({ message: 'success', updatedFollowers: updatedUser.followers });
    } catch (error) {
        console.error('Error removing follower:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};



// usersCltr.removeFollowers = async (req, res) => {
//     // console.log('')
//     try {
//         const body = req.body
//         const user = await User.findById(req.userId)
//         console.log('users folowers', user.followers)
//         const updatedFollowers = user.followers.filter((ele) => {
//             return ele.id !== body.idToRemove
//         })
//         console.log('user to fdin ', updatedFollowers)
//         const updatedUser = await User.findByIdAndUpdate(req.userId, { followers: updatedFollowers }, { new: true, runValidators: true })
//         // console.log('body inside the remove followers ' , req.body)
//         conosle.log('updatedUser ----------> ', updatedUser)
//         res.json({ message: 'success', updatedFollowers: updatedUser.followers })
//     }
//     catch (e) {
//         res.json(e)
//     }
// }


//handle followers
usersCltr.oldfollowers = async (req, res) => {
    // console.log('followers', req.body)
    const data = req.body
    // console.log('data [0]', data[0])
    // console.log('data followers', data)
    console.log("inside the user followers module ")

    try {
        User.findById(req.userId)
            .then((currUser) => {
                const name = { id: req.userId, username: currUser.username }
                // console.log('followers details', currUser)
                User.findById(data.id)
                    .then((user) => {
                        const len = user.followers.length
                        if (len !== 0) {
                            for (let i = 0; i < len; ++i) {
                                if (user.followers[i].id === name.id) {
                                    // console.log('---------------------------------------------already following')
                                    res.json({ message: 'Already following' })
                                }
                            }
                        } else {
                            const arr = [...user.followers]
                            arr.push(name)
                            user.followers = arr

                            User.findByIdAndUpdate(data.id, user, { new: true, runValidators: true })
                                .then((updatedUser) => {
                                    // console.log('updated user check', updatedUser)
                                    // res.json(updatedUser.followers)
                                    const obj = { message: 'success' }
                                    res.json(obj)
                                })
                                .catch((err) => {
                                    res.json(err)
                                })


                        }
                    })
                    .catch((err) => {
                        res.json(err)
                    })
            })
            .catch((err) => {
                res.json(err)
            })
    }
    catch (e) {
        res.json(e)
    }

    // User.findById(data.id)
    //     .then((user) => {
    //         const arr = [...user.followers]
    //         User.findById(req.userId)
    //             .then((currUser) => {
    //                 arr.push(currUser.username)
    //             })
    //             .catch((err) => {
    //                 res.json(err)
    //             })

    //     })
    //     .catch((err) => {
    //         res.json(err)
    //     })

    // User.findById(req.userId)
    //     .then((user) => {
    //         const arr = [...user.followers]
    //         arr.push(data[data.length-1])
    //         user.followers = arr
    //         User.findByIdAndUpdate(req.userId , user, {new:true,runValidators:true})
    //             .then((updatedUser) => {
    //                 console.log('updated user',updatedUser)
    //                 res.json(updatedUser.followers)
    //             })
    //             .catch((err) => {
    //                 res.json(err)
    //             })
    //     })
    //     .catch((err) => {
    //         res.json(err)
    //     })

    // User.findById(req.userId)
    //     .then((user) => {
    //         console.log('user follower' , user.followers)
    //         const follower = user.followers
    //         follower.push(req.body.name)
    //         console.log('follower', follower)
    //         user.followers = [...follower]
    //         res.json(user)
    //     })
    //     .catch((err) => {
    //         res.json(err)
    //     })    
}


//this was for the react full calender

usersCltr.specificUsers = (req, res) => {
    // console.log('specific user')
    const { id } = req.params
    // console.log('request object from the specificusers', id)
    User.findById(id)
        .then((user) => {
            // console.log('found the user',user)
            res.json(user)
        })
        .catch((err) => {
            console.log(err)
        })
}


usersCltr.currentUser = async (req, res) => {
    try {
        // console.log('inside the current user function')
        const user = await User.findById(req.userId)
        if (user) {
            res.json(user)
            // console.log('current user', user)
        } else {
            res.json({ error: '404' })
        }
    }
    catch (e) {
        res.json(e)
    }
}

usersCltr.pictureUpdate = async (req, res) => {
    try {
        const { body } = req
        // console.log('req.file',req.file)
        // console.log('req.userId',req.userId)
        const file = req.file

        //cloudinary integration

        const cloudinaryUploadResult = await cloudinary.uploader.upload(file.path, (err,result) => {
            if(err){
                console.log("error in uploading " , err)
            }else {
                console.log('success fully uploaded ' , result)
            }
        })

        User.findById(req.userId)
            .then((user) => {
                user.profilePicture = cloudinaryUploadResult.secure_url
                // console.log('user check',user)
                User.findByIdAndUpdate(req.userId, user, { new: true, runValidators: true })
                    .then((userUpdated) => {
                        // console.log('updated user', userUpdated)
                        res.json(userUpdated)
                    })
                    .catch((err) => {
                        res.json(err)
                    })

            })
            .catch((err) => {
                res.json(err)
            })
    }
    catch (err) {
        conosle.log(err)
    }
}

// usersCltr.updatePicture = async (req, res) => {
//     console.log('req for file',req)
//     try{
//         const {body} = req
//         const user = await User.findById(body.id)
//         // const file = req.file
//         // const formdata = {
//             // profilePicture:file.filename
//         // }
//         // console.log(file)
//         // const user = await User.findByIdAndUpdate(req.userId , formdata, {new:true, runValidators:true} )
//         res.json(user)
//     }
//     catch(err){
//         res.json(err)
//     }
// }

usersCltr.register = async (req, res) => {
    //validation errors
    const errors = validationResult(req)
    // console.log('validation errors', errors)
    // console.log('errors in the register' , errors)
    // console.log('errors in the is empty' , errors.isEmpty())
    // console.log('req.file', req.file)
    if (!errors.isEmpty()) {
        res.json({ errors: errors.array() })
    }
    else {
        console.log('req file ', req.file)
        try {
            const body = req.body
            const file = req.file

            console.log('file check inside the register functionality',file)

            // uploading file to cloudinary
            const cloudinaryUploadResult = await cloudinary.uploader.upload(file.path, (err, result) => {
                if (err) {
                    console.log('error in upload ', err)
                } else {
                    console.log('success fully uploaded', result)
                }
            })

            console.log('cloudinary uploaded', cloudinaryUploadResult)
            //
            // console.log('body = ', body)
            // console.log('file = ', file.destination + '/' + file.filename)
            // res.json({error: 'successfullt submitted the user'})
            const userObj = new User({
                username: body.username,
                email: body.email,
                phone: body.phone,
                password: body.password,
                city: body.city,
                sport: body.sport,
                profilePicture: cloudinaryUploadResult.secure_url,
                // profilePicture: file.filename,
                role: body.role,
                bio: body.bio
                // profilePicture: file.destination + '/' + file.filename
            })

            // checking if the user already exist or not
            const userCheckEmail = await User.findOne({ email: userObj.email })
            const userCheckPhone = await User.findOne({ phone: userObj.phone })

            if (userCheckEmail && userCheckPhone) {
                res.json({ error: 'user already exist with this email/phone please login' })
            } else if (userCheckEmail) {
                res.json({ error: 'user already exist with this email/phone please login' })
            } else if (userCheckPhone) {
                res.json({ error: 'user already exist with this email/phone please login' })
            } else {
                const salt = await bcrypt.genSalt()
                const hashPassword = await bcrypt.hash(userObj.password, salt)
                userObj.password = hashPassword

                const user = await userObj.save()
                res.json(user)
            }
        } catch (e) {
            res.json(e)
        }
    }
}

// const {body} = req
// const user = new User(body)

// user.save()
//     .then((user) => {
//         res.json(user)
//     })
//     .catch((err) => {
//         res.json(err)
//     })


usersCltr.picture = async (req, res) => {
    try {
        const { id } = req.params
        const user = await User.findById(id)
        res.json(user)
    }
    catch (e) {
        res.json(e)
    }
}


usersCltr.login = async (req, res) => {
    try {
        const { body } = req
        const user = await User.findOne({ email: body.email })
        if (user) {
            const result = await bcrypt.compare(body.password, user.password)
            if (result) {
                // res.json(user)
                const tokenData = { id: user._id, username: user.username }
                const token = jwt.sign(tokenData, process.env.JWT_SECRET)
                res.json({
                    token: `Bearer ${token}`
                })
            } else {
                res.json({ error: 'invalid email or password' })
            }
        } else {
            res.json({ error: 'invalid email or password' })
        }
    } catch (e) {
        // console.log('error in catch block')
        res.json(e)
    }
}

usersCltr.account = async (req, res) => {
    try {
        const user = await User.findById(req.userId)
        if (user) {
            res.json(user)
        } else {
            res.json({ error: 'user not found' })
        }
    } catch (e) {
        res.json(e)
    }

}

usersCltr.search = (req, res) => {
    const { body } = req
    User.find({ city: body.city, sport: body.sport })
        .then((users) => {
            const newUsers = users.filter((user) => {
                return user._id.toString() !== req.userId
            })
            res.json(newUsers)
        })
        .catch((err) => {
            res.json(err)
        })
}


usersCltr.player = (req, res) => {
    const { id } = req.params
    User.findById(id)
        .then((player) => {
            res.json(player)
        })
        .catch((err) => {
            res.json(err)
        })
}

usersCltr.removePlayer = (req, res) => {
    const userIdObj = new mongoose.Types.ObjectId(req.userId)
    const obj = {}
    const error = {}

    User.findById(req.userId)
        .then((user) => {
            User.findByIdAndDelete(res.userId)
                .then((user) => {
                    obj.user = user
                })
                .catch((err) => {
                    error.user = err
                })

            Booking.deleteMany({ userId: req.userId })
                .then((booking) => {
                    obj.booking = booking
                })
                .catch((err) => {
                    error.booking = err
                })

            res.json(obj)
        })
        .catch((err) => {
            res.json(err)
        })
}

usersCltr.removeUser = (req, res) => {
    const userIdObj = new mongoose.Types.ObjectId(req.userId)
    // console.log(userIdObj)

    const obj = {}
    const error = {}
    User.findByIdAndDelete(req.userId)
        .then((user) => {
            // res.json(user)
            obj.user = user
            Ground.deleteMany({ userId: req.userId })
                .then((grounds) => {
                    obj.grounds = grounds
                    // res.json(grounds)
                })
                .catch((err) => {
                    error.ground = err
                    // res.json(error)
                })
            Booking.deleteMany({ managerId: req.userId })
                .then((booking) => {
                    obj.booking = booking
                })
                .catch((err) => {
                    error.booking = err
                    res.json(error)
                })

            res.json(obj)
        })
        .catch((err) => {
            error.User = err
            res.json(error)
        })
}


usersCltr.delete = async (req, res) => {
    try {
        const userIdObj = mongoose.Types.ObjectId(req.userId)
        // console.log(userIdObj)
        const user = await User.findById(req.userId)
        // console.log(user._id.toString())
        // console.log(req.userId)
        const ground = await Ground.findBy({ userId: userIdObj })
        // console.log(ground)
        res.json({
            'msg': 'reaching'
        })
    }
    catch (err) {
        res.json(err)
    }

}
// const { id } = req.params
// User.findByIdAndDelete(id)
//     .then((user) => {
//         res.json(user)
//     })
//     .catch((err) => {
//         res.json(err)
//     })



usersCltr.updateDetails = (req, res) => {

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        res.json({ errors: errors.array() })
    } else {
        const { body } = req

        User.findByIdAndUpdate(req.userId, body, { new: true, runValidators: true })
            .then((user) => {
                res.json(user)
            })
            .catch((err) => {
                res.json(err)
            })

    }

    // const objectUser = new User(body)
    // console.log('body', body)

    // const user = User.findById(req.userId)

    // if(user.password === body.password){
    //     const userObj = await User.findByIdAndUpdate(req.userId , body, { new: true, runValidators: true})
    //     console.log('same password',userObj)
    //     res.json(userObj)
    // }else{
    //     const salt = await bcrypt.genSalt()
    //     const hashPassword = await bcrypt.hash(body.password,salt)
    //     objectUser.password = hashPassword

    //     const result = await User.findByIdAndUpdate(req.userId, objectUser , { new: true, runValidators:true})
    //     console.log('change password', result)
    //     res.json(result)

    // }

}

usersCltr.update = (req, res) => {
    const id = req.params.id
    const body = req.body
    // console.log('update', body)
    User.findByIdAndUpdate(id, body, { new: true, runValidators: true })
        .then((user) => {
            res.json(user)
        })
        .catch((err) => {
            res.json(err)
        })
}

usersCltr.show = (req, res) => {
    const { id } = req.params
    User.findById(id)
        .then((user) => {
            res.json(user)
        })
        .catch((err) => {
            res.json(err)
        })
}

module.exports = usersCltr