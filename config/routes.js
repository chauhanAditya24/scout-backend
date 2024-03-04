const express = require('express')
const router = express.Router()
const usersCltr = require('../controllers/usersCltr')
const groundsCltr = require('../controllers/groundCltr')
const citiesCltr = require('../controllers/cityCltr')
const sportsCltr = require('../controllers/sportsCltr')
const bookingsCltr = require('../controllers/bookingsCltr')
const adminCltr = require('../controllers/adminCltr')
const messageCltr = require('../controllers/messageCltr')
const groupCltr = require('../controllers/groupCltr')
const authenticateUser = require('../middlewares/authenticate')
const bookingStore = require('../middlewares/bookingStore')
const multer = require('multer')

//express-validator
const { checkSchema } = require('express-validator')
const userUpdateSchema = require('../validationSchemas/userUpdateSchema')
const bookingValidationSchema = require('../validationSchemas/bookingValidationSchema')
const groundsValidationSchema = require('../validationSchemas/groundsValidationSchema')
const usersValidationSchema = require('../validationSchemas/usersValidationSchema')
const sportsValidationSchema = require('../validationSchemas/sportsValidationSchema')
const citiesValidationSchema = require('../validationSchemas/citiesValidationSchema')

const chatCltr = require('../controllers/chatCltr')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
        cb(null, true)
    } else {
        cb({ error: 'check your image type' }, false)
    }
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 100
    }
    // fileFilter: fileFilter
})

//mail confirmation
router.get('/scout/mail', authenticateUser, usersCltr.mail)
//payment gateay
router.post('/scout/create-checkout-session', usersCltr.payment)
//

// router.get('/get-booking-data/:sessionId', async (req, res) => {
//     try {
//         const { sessionId } = req.params;
//         const session = await stripe.checkout.sessions.retrieve(sessionId);
//         const bookingData = session.metadata.bookingData;
//         res.json({ success: true, bookingData });
//     } catch (error) {
//         console.error('Error retrieving booking data:', error);
//         res.json({ success: false, error: 'Failed to retrieve booking data' });
//     }
// });


//
//usersCltr functionalities
router.get('/scout/list', authenticateUser, usersCltr.list)
router.post('/scout/register', upload.single('profilePicture'), usersValidationSchema, usersCltr.register)
// testing image on frontend temporary api
router.get('/scout/image/:id', usersCltr.picture)
router.delete('/scout/remove/:id', usersCltr.delete)
router.put('/scout/update/:id', authenticateUser, usersCltr.update)
router.get('/scout/show/:id', usersCltr.show)
router.post('/scout/login', usersCltr.login)
router.get('/scout/user/account', authenticateUser, usersCltr.account)
router.put('/scout/user/update', authenticateUser, userUpdateSchema, usersCltr.updateDetails)
// route to get specific userso for a particualr city and sport
router.post('/scout/users/specific', authenticateUser, usersCltr.search)
router.get('/scout/player/:id', usersCltr.player)
router.get('/scout/user/login', authenticateUser, usersCltr.currentUser)
//updating profile picture
// router.put('/scout/update/profilePicture', upload.single('profilePicture'), authenticateUser, usersCltr.updatePicture)
router.put('/scout/picture/update', upload.single('profilePicture'), authenticateUser, usersCltr.pictureUpdate)
//remove an account permanently
router.delete('/scout/acount/remove', authenticateUser, usersCltr.removeUser)
//updating followers
router.put('/scout/user/followers', authenticateUser, usersCltr.followers)
//listing followers
router.get('/scout/list/followers', authenticateUser, usersCltr.listFollowers)
router.post('/scout/remove/followers', authenticateUser, usersCltr.removeFollowers)

// following *****
router.get('/scout/list/following' , authenticateUser , usersCltr.listFollowing)
router.put('/scout/add/following',authenticateUser, usersCltr.addFollowing)
router.put('/scout/remove/following', authenticateUser , usersCltr.removeFollowing)


//cities
router.post('/scout/cities', citiesValidationSchema, citiesCltr.add)
router.get('/scout/cities/list', citiesCltr.list)

//sports
router.post('/scout/sports', sportsValidationSchema, sportsCltr.add)
// router.post('/scout/sports', checkSchema(sportsValidationSchema), sportsCltr.add)
router.get('/scout/sports/list', sportsCltr.list)

// ground functionalities
router.get('/scout/grounds/all', groundsCltr.list)
router.post('/scout/grounds/register', upload.single('groundPicture'), groundsValidationSchema, groundsCltr.register)
router.delete('/scout/grounds/remove/:id', groundsCltr.delete)
router.get('/scout/grounds/:id', groundsCltr.show)
router.put('/scout/grounds/update/:id', groundsCltr.update)
// to find ground based on city and sport
router.post('/scout/grounds/specific', authenticateUser, groundsCltr.search)
router.get(`/scout/ground/selected/:id`, groundsCltr.selectedGround)
//grounds own by a particular user
router.get('/scout/ground/user', authenticateUser, groundsCltr.usersGround)
//updating the picture of ground
router.put(`/scout/groundPicture/update/:id`, upload.single('groundPicture'), authenticateUser, groundsCltr.pictureUpdate)

// session test
router.post('/scout/session', bookingStore, bookingsCltr.sessionTest)

//booking ground
//booking api
router.post('/scout/ground/book', authenticateUser, bookingValidationSchema.book, bookingsCltr.book)
//to check the timeslot
router.post('/scout/ground/availability', bookingValidationSchema.check, authenticateUser, bookingsCltr.check)
// list all the bookings
router.get('/scout/bookings', authenticateUser, bookingsCltr.list)
//cancel a booking
router.get('/scout/bookings/cancel/:id', authenticateUser, bookingsCltr.cancel)
router.get('/scout/bookings/manager', authenticateUser, bookingsCltr.managerList)

//admin routes
router.get('/admin/view/details/:id', authenticateUser, adminCltr.details)

router.get('/scout/findingUser/:id', authenticateUser, usersCltr.specificUsers)

//group chat 
// router.post('/scout/createGroup',authenticateUser ,groupCltr.createGroup)
// router.get('/scout/Group',authenticateUser ,groupCltr.chat)
// router.post('/scout/message' ,authenticateUser ,groupCltr.message)


//chattting 
router.post('/scout/chat', authenticateUser, chatCltr.accessChat)
router.get('/scout/getChats', authenticateUser, chatCltr.fetchChats)
router.post('/scout/chat/group', authenticateUser, chatCltr.createGroupChat)
router.put('/scout/chat/rename', authenticateUser, chatCltr.renameChat)
router.put('/scout/group/add', authenticateUser, chatCltr.addMember)
router.put('/scout/group/remove', authenticateUser, chatCltr.removeMember)
router.get('/scout/chats/all', authenticateUser, chatCltr.usersChat)

//messageing
router.post('/scout/messages', authenticateUser, messageCltr.sendMessage)
router.get('/scout/allMessages/:chatId', authenticateUser, messageCltr.allMessages)


module.exports = router 