const mongoose = require('mongoose')
const validator = require('validator')


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

module.exports = User