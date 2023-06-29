const mongoose = require('mongoose')
const validator = require('validator')
const connectionURL = 'mongodb://127.0.0.1:27017/task-manager-api'



mongoose.connect(connectionURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
    })


// creating a user model
const User = mongoose.model('User', {
    name: {
        type: String,
        required: true,
        trim: true // removes the extra spaces
    },
    email: {
        type:String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    age: {
        type: Number,
        default: 0, // default value
        validate(value) {
            if(value < 0) {
                throw new Error('Age must be a positive number')
            }
        }
    },
    password : {
        type: String,
        trim: true,
        validate(value) {
            if(value.length < 6) {
                throw new Error('Password must be greater than 6 characters')
            }
            if(value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"')
            }
        }
    }
})


// const me = new User({
//     name: 'Hari',
//     email: 'Hari@gmail.com',
//     age: 10
// })

// me.save().then((result) => {
//     console.log(result)
// }).catch((error) => {
//     console.log(error)
// })

const Task = mongoose.model('Task', {
    description: {
        type: String,
        required: true,
        trim: true // removes the extra spaces
    },
    completed: {
        type: Boolean,
        default: false
    }
})



// const task = new Task({
//     description: 'job',
//     completed: false
// })

// task.save().then((result) => {
//     console.log(result);
// }).catch((error) => {
//     console.log(error);
// })