const express = require('express')
const router = express.Router()
const usersCltr = require('../controllers/usersCltr')
const groundsCltr = require('../controllers/groundCltr')
const citiesCltr = require('../controllers/cityCltr')
const sportsCltr = require('../controllers/sportsCltr')
const authenticateUser = require('../middlewares/authenticate')


//usersCltr functionalities
router.get('/scout/list', usersCltr.list)
router.post('/scout/register', usersCltr.register)
router.delete('/scout/remove/:id', usersCltr.delete)
router.put('/scout/update/:id', authenticateUser ,usersCltr.update)
router.get('/scout/show/:id', usersCltr.show)
router.post('/scout/login', usersCltr.login)
router.get('/scout/user/account', authenticateUser, usersCltr.account)
router.put('/scout/user/update' , authenticateUser, usersCltr.updateDetails)
// route to get specific userso for a particualr city
router.post('/scout/users/specific', authenticateUser, usersCltr.search)
router.get('/scout/player/:id', usersCltr.player)



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

module.exports = router 