const mongoose = require('mongoose')
// const path = require('path')
// require('dotenv').config({ path: path.resolve(__dirname, '../../config/dev.env') })


const connectionURL = process.env.MONGODB_URL 



mongoose.connect(connectionURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
    }).then(() => {
        console.log('Connected to MongoDB')
    })


