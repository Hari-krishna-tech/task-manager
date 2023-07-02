const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
// const path = require('path')
// require('dotenv').config({ path: path.resolve(__dirname, '../../config/dev.env') })



const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true // removes the extra spaces
    },
    email: {
        type:String,
        unique: true,  // no two users can have the same email
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
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],

    avatar: {
        type: Buffer
    }
}, {
    timestamps:true
})

// This is a virtual property

UserSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})


UserSchema.methods.generateAuthToken = async function() {
    const user = this

    const token = jwt.sign( {_id: user._id.toString()  }, process.env.JWT_SECRET, { expiresIn: '7 days' } )
    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token;
}
UserSchema.methods.toJSON = function() {
    const user = this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar
    return userObject;

}


UserSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })

    if(!user) {
        throw new Error("Unable to login")
    }

    const isMatch = await bcrypt.compare(password, user.password)
    
    if(!isMatch) {
        throw new Error("Unable to login")
    }
    
    return user
}

// Hash the plain text password before saving
UserSchema.pre('save', async function(next) {
    const user = this

    if(user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    
    next()
})

// Delete user tasks when user is removed
UserSchema.pre('remove', async function(next) {
    const user = this
    await Task.deleteMany({ owner: user._id })
    next()
})


const User = mongoose.model('User', UserSchema)

module.exports = User