const jwt = require('jsonwebtoken')
const User = require('../models/user')


const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '') // remove the string 'Bearer ' from the token
        const decoded = jwt.verify(token, 'thisismynewcourse') // verify the token
        if(!decoded) {
            throw new Error()
        }
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token }) // find the user with the correct id and 
        // the token in the tokens array
        if(!user) {
            throw new Error()
        }
        req.token = token
        req.user = user
        next()
    } catch(e) {
        res.status(401).send({ error: 'Please authenticate.' })
    }
    

}

module.exports = auth