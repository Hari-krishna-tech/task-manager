const express = require('express')
const bodyParser = require('body-parser')
require('./db/mongoose')
const UserRouter = require('./routers/user')
const TaskRouter = require('./routers/task')


// creating an express application
const app = express()
const port = process.env.PORT || 3000


app.use((req, res, next) => {
    
    next()
})

// app.use((req, res, next) => {
//     res.status(503).send('Site is currently down. Check back soon!')
// })


// middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// registering the router
app.use(UserRouter)
app.use(TaskRouter)




// starting the server
app.listen(port, () => {
    console.log('Server is up on port ' + port)
})

