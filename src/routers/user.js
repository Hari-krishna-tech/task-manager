const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = new express.Router()
const multer = require('multer')
const sharp = require('sharp')


const upload = multer({
    
    limits: {
        fileSize: 1000000 // 1 MB
    },
    fileFilter(req, file, cb) {

        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image'))
        }
        cb(undefined, true)

    }

})


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

router.post('/users/me/avatar' ,auth,upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer() // convert to png
    try {
        req.user.avatar = buffer
        await req.user.save() // instance method
        res.send()
    } catch(error) {
        res.status(400).send()
    }
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
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

router.delete('/users/me/avatar', auth, async (req, res) => {
    try {
        req.user.avatar = undefined
        await req.user.save() // instance method
        res.send()
    } catch(error) {
        res.status(500).send()
    }
})


router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id) // class method
        if(!user || !user.avatar) {
            throw new Error()
        }
        res.set('Content-Type', 'image/png')
        res.send(user.avatar)

    } catch(error) {
        res.status(404).send()
    }
})



module.exports = router