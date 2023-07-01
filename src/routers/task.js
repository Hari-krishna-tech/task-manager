const express = require('express')
const Task = require('../models/task')
const router = new express.Router()
const auth = require('../middleware/auth')



router.post('/tasks',auth,async (req, res) => {
    //  const task = new Task(req.body)
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    try {
        await task.save()
        res.send(task)
    } catch(error) {
        res.status(400)
        res.send(error)
    }
    
})

router.get('/tasks', auth,async (req, res) => {
    try {
        const tasks = await Task.find({owner: req.user._id})
        res.send(tasks)
    } catch(error) {
        res.status(500)
        res.send(error)
    }
    
})


router.get('/tasks/:id',auth,async (req, res) => {
    const _id = req.params.id
    try {
        const task = await Task.findOne({ _id, owner: req.user._id })
        if (!task) {
            res.status(404)
            return res.send("Task not found")
        }
        res.send(task)
    } catch(error) {
        res.status(500)
        res.send(error)
    }
    
})

router.patch('/tasks/:id',auth , async (req, res) => {
    const _id = req.params.id
    const allowedUpdates = ['description', 'completed']
    const updates = Object.keys(req.body)

    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        res.status(400)
        return res.send({ error: 'Invalid updates!' })
    }
    try {
        const task = await Task.findOne({_id,owner: req.user._id})
        
        //const task = await Task.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true })
        
        if (!task) {
            res.status(404)
            return res.send("Task not found")
        }

        updates.forEach((update) => task[update] = req.body[update])
        await task.save() 
        
        res.send(task)

    } catch(error) {
        res.status(400)
        res.send("error in patch")
    }
})


router.delete('/tasks/:id', auth ,async (req, res) => {
    const _id = req.params.id
    try {
        const task = await Task.findOneAndDelete({_id, owner: req.user._id})
        if (!task) {
            res.status(404)
            return res.send("Task not found")
        }
        res.send(task)
    } catch(error) {
        res.status(500)
        res.send(error)
    }
})

module.exports = router