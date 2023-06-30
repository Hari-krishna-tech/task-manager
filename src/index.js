const express = require('express')
const bodyParser = require('body-parser')
require('./db/mongoose')
const User = require('./models/user')
const Task = require('./models/task')

const app = express()
const port = process.env.PORT || 3000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.post('/users', (req, res) => {
    const user = new User(req.body)

    user.save().then(() => {
        res.send(user)
    }).catch((error) => {
        res.status(400)
        res.send(error)
    })
})

app.get('/users', (req, res) => {
    User.find({}).then((users) => {
        res.send(users)
    }).catch((error) => {
        res.status(500)
        res.send(error)
    })
})

app.get('/users/:id', (req, res) => {
    const _id = req.params.id
    User.findById(_id).then((user) => {
        if (!user) {
            res.status(404)
            return res.send("User not found")   
        }
        res.send(user)
    }).catch((error) => {
        res.status(500)
        console.log(error)
    })
})



app.post('/tasks', (req, res) => {
    const task = new Task(req.body)

    task.save().then((result) => {
        res.send(result)
    }).catch((error) => {
        res.status(400)
        res.send(error)
    })
})

app.get('/tasks', (req, res) => {
    console.log(req.params.id)
    Task.find({}).then((tasks) => {
        res.send(tasks)
    }).catch((error) => {
        res.status(500)
        res.send(error)
    })
})

app.get('/tasks/:id', (req, res) => {
    const _id = req.params.id
    console.log(_id)
    Task.findById(_id).then((task) => {
        if (!task) {
            res.status(404)
            return res.send("Task not found")
        }
        console.log(task)
        res.send(task)
    }).catch((error) => {
        res.status(500)
        res.send(error);
    })
})

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})


