const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = new express.Router()


router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save() // instance method
        const token = await user.generateAuthToken() // instance method
       
        res.send({ user, token })
    } catch(error) {
        res.status(400)
        res.send(error)
    }
    
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken() // instance method
        res.send({ user, token })

    } catch(error) {
        res.status(400).send()
    }
})
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((tokenObj) => {
            return tokenObj.token !== req.token
        })
        await req.user.save()
        res.send()
    } catch(error) {
       res.status(500).send()

    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save() // instance method
        res.send()
    } catch(error) {
        res.status(500).send()
    }
})

router.get('/users/me',auth,async (req, res) => {

    res.send(req.user)
    
})


router.patch('/users/me', auth ,async (req, res) => {
   

    const allowedUpdates = ['name', 'email', 'password', 'age']
    const updates = Object.keys(req.body)

    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        res.status(400)
        return res.send({ error: 'Invalid updates!' })
    }

    
    try {

        
        updates.forEach((update) => req.user[update] = req.body[update])

        await req.user.save()
        // //const user = await User.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true })
        // console.log(user)
        
        res.send(req.user)
    } catch(error) {
        res.status(400)
        res.send(error)
    }
})

router.delete('/users/me', auth,async (req, res) => {
    
    try {
        // const user = await User.findByIdAndDelete(req.user._id)
        // if (!user) {
        //     res.status(404)
        //     return res.send("User not found")
        // }
        await User.deleteOne(req.user._id)
        res.send(req.user)
    } catch(error) {
        res.status(500)
        res.send(error)
    }
})



module.exports = router