const jwt = require('jsonwebtoken')

const authenticateUser = ( req , res , next ) => {
    let token = req.header('authorization')
    if(token){
        token = token.split(' ')[1]

        try{
            const tokenData = jwt.verify( token , process.env.JWT_SECRET)
            console.log(tokenData)
            req.userId = tokenData.id
            next()
        }catch(e){
            res.json(e)
        }
    }else{
        res.json({error: 'token not present'})
    }
}

module.exports = authenticateUser