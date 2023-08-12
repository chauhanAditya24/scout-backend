const User = require('../models/users')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

usersCltr = {}

//listing all the users
usersCltr.list = (req, res) => {
    User.find()
        .then((user) => {
            res.json(user)
        })
        .catch((err) => {
            res.json(err)
        })
}


usersCltr.currentUser = async (req, res) => {
    try {
        console.log('inside the current user function')
        const user = await User.findById(req.userId)
        if (user) {
            res.json(user)
            console.log('current user', user)
        } else {
            res.json({ error: '404' })
        }
    }
    catch (e) {
        res.json(e)
    }
}

usersCltr.register = async (req, res) => {

    console.log('req file ', req.file)
    try {
        const body = req.body
        const file = req.file
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
            profilePicture: file.filename,
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
        console.log('error in catch block')
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
            res.json(users)
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

usersCltr.delete = (req, res) => {
    const { id } = req.params
    User.findByIdAndDelete(id)
        .then((user) => {
            res.json(user)
        })
        .catch((err) => {
            res.json(err)
        })
}

usersCltr.updateDetails = (req, res) => {
        const { body } = req

        User.findByIdAndUpdate(req.userId, body, { new: true, runValidators: true })
            .then((user) => {
                res.json(user)
            })
            .catch((err) => {
                res.json(err)
            })


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
    console.log('update', body)
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