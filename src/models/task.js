
const mongoose = require('mongoose')

const TaskSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true // removes the extra spaces
    },
    completed: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId, // This is the type of the id of the user
        required: true,
        ref: 'User' // This is the name of the model

    }
}, {
    timestamps:true
})



const Task = mongoose.model('Task', TaskSchema)

module.exports = Task