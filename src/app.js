const express = require('express')
const bodyParser = require('body-parser')
require('./db/mongoose')
const UserRouter = require('./routers/user')
const TaskRouter = require('./routers/task')



// creating an express application
const app = express()



// middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// registering the router
app.use(UserRouter)
app.use(TaskRouter)




// starting the server
module.exports = app
