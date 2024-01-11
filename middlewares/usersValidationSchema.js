const User = require('../models/users')

const validationSchema = {
    username: {
        in: ['body'],
        isString: true,
        isLength: {
            options: { min: 4, max: 64 },
            errorMessage: 'Username must be between 4 and 64 characters'
        },
        custom: {
            options: async (value) => {
                const existingUser = await User.findOne({ username: value })
                console.log('checking for existing user', existingUser)
                if (existingUser) {
                    throw new Error('username already taken please change it')
                }
                return true
            }
        }
    },
    email: {
        in: ['body'],
        isString: true,
        isEmail: {
            errorMessage: 'Invalid E-mail'
        },
        custom: {
            options: async (value) => {
                const existingUser = await User.findOne({ email: value })
                if (existingUser) {
                    throw new Error('E-mail already registered')
                }
                return true
            }
        }
    },
    phone: {
        in: ['body'],
        isString: true,
        isLength: {
            options: { min: 10, max: 10 },
            errorMessage: 'Number should contian 10 digits'
        },
        custom: {
            options: async (value) => {
                const existingUser = await User.findOne({ phone: value })
                if (existingUser) {
                    throw new Error('Phone number already registered')
                }
            }
        }
    },
    password: {
        in: ['body'],
        isString: true,
        isLength: {
            options: { min: 8, max: 16 },
            errorMessage: 'Password should be between 8 and 16 characters'
        }
    },
    profilePicture: {
        in: ['file'],
        custom: {
            options: async (file, { req }) => {
                conosle.log('file : ' , file, 'req :' ,req.file)
                if(!req.file){
                    console.log('no file uploaded')
                    throw new Error('please upload profile picture')
                }
                return true
            }
        }
    },
    city: {
        in: ['body'],
        isString: true,
        isLength: {
            options: { min: 1 },
            errorMessage: 'Please select a city'
        }
    },
    sport: {
        in: ['body'],
        isString: true,
        isLength: {
            options: { min: 1 },
            errorMessage: 'Please select a sport'
        }
    },
    role: {
        in: ['body'],
        isString: true,
        isLength: {
            options: { min: 1 },
            errorMessage: 'Please select a role'
        }
    },
    bio: {
        in: ['body'],
        isString: true,
        isLength: {
            options: { min: 5, max: 100 },
            errorMessage: 'Bio should have characters between 5 and 100 characters'
        }
    }

}

module.exports = validationSchema