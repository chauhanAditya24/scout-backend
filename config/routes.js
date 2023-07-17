const express = require('express')
const router = express.Router()
const usersCltr = require('../controllers/usersCltr')

//usersCltr functionalities
router.get('/scout/list', usersCltr.list)
router.post('/scout/register', usersCltr.register)
router.delete('/scout/remove/:id', usersCltr.delete)
router.put('/scout/update/:id', usersCltr.update)
router.get('/scout/show/:id', usersCltr.show)

module.exports = router