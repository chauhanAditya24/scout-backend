const User = require('../models/users')

const adminCltr = {}

adminCltr.details = async (req, res) => {
    try{
        const { id } = req.params
        const user = await User.findById(id)
        res.json(user)
    }
    catch(err){
        res.json(err)
    }
}

module.exports = adminCltr