const express = require('express')
const router = express.Router()
const usersCltr = require('../controllers/usersCltr')
const groundsCltr = require('../controllers/groundCltr')
const citiesCltr = require('../controllers/cityCltr')
const sportsCltr = require('../controllers/sportsCltr')
const bookingsCltr = require('../controllers/bookingsCltr')
const authenticateUser = require('../middlewares/authenticate')
const multer = require('multer')

const storage = multer.diskStorage({
    destination: function ( req, file, cb) {
        cb(null , 'public/images')
    },
    filename: function ( req, file, cb) {
        cb( null ,Date.now()+ '-' +file.originalname)
    }
})

const fileFilter = ( req , file ,cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png' ){
        cb(null , true)
    }else{
        cb({error: 'check your image type'},false)
    }
}

const upload = multer({ 
    storage: storage , 
    limits:{
    fileSize: 1024 * 1024 * 100
    }
    // fileFilter: fileFilter
})

//usersCltr functionalities
router.get('/scout/list', usersCltr.list)
router.post('/scout/register', upload.single('profilePicture') ,usersCltr.register)
// testing image on frontend temporary api
router.get('/scout/image/:id', usersCltr.picture)
router.delete('/scout/remove/:id', usersCltr.delete)
router.put('/scout/update/:id', authenticateUser ,usersCltr.update)
router.get('/scout/show/:id', usersCltr.show)
router.post('/scout/login', usersCltr.login)
router.get('/scout/user/account', authenticateUser, usersCltr.account)
router.put('/scout/user/update' , authenticateUser, usersCltr.updateDetails)
// route to get specific userso for a particualr city
router.post('/scout/users/specific', authenticateUser, usersCltr.search)
router.get('/scout/player/:id', usersCltr.player)
router.get('/scout/user/login',authenticateUser, usersCltr.currentUser)


//cities
router.post('/scout/cities', citiesCltr.add)
router.get('/scout/cities/list', citiesCltr.list)

//sports
router.post('/scout/sports', sportsCltr.add)
router.get('/scout/sports/list', sportsCltr.list)

// ground functionalities
router.get('/scout/grounds/all', groundsCltr.list)
router.post('/scout/grounds/register', groundsCltr.register)
router.delete('/scout/grounds/remove/:id', groundsCltr.delete)
router.get('/scout/grounds/:id', groundsCltr.show)
router.put('/scout/grounds/update/:id', groundsCltr.update)
// to find ground based on city and sport
router.post('/scout/grounds/specific',authenticateUser, groundsCltr.search)
router.get(`/scout/ground/selected/:id` , groundsCltr.selectedGround)
//grounds own by a particular user
router.get('/scout/ground/user',authenticateUser,groundsCltr.usersGround)


//booking ground
router.post('/scout/ground/book', authenticateUser ,bookingsCltr.book)
router.post('/scout/ground/availability', authenticateUser ,bookingsCltr.check)



module.exports = router 