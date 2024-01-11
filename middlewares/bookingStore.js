const bookingStore = (req, res, next) => {
    try{
        console.log('===============booking store==============',req.body)
        next()
    }
    catch(err){
        res.json({error: 'booking data misplaced'})
    }
}

module.exports = bookingStore