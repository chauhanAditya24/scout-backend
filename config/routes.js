const express = require('express')
const router = express.Router()
const usersCltr = require('../controllers/usersCltr')
const groundsCltr = require('../controllers/groundCltr')

//usersCltr functionalities
router.get('/scout/list', usersCltr.list)
router.post('/scout/register', usersCltr.register)
router.delete('/scout/remove/:id', usersCltr.delete)
router.put('/scout/update/:id', usersCltr.update)
router.get('/scout/show/:id', usersCltr.show)

// ground functionalities
router.get('/scout/grounds/all', groundsCltr.list)
router.post('/scout/grounds/register', groundsCltr.register)
router.delete('/scout/grounds/remove/:id', groundsCltr.delete)
router.get('/scout/grounds/:id', groundsCltr.show)
router.put('/scout/grounds/update/:id', groundsCltr.update)

module.exports = router