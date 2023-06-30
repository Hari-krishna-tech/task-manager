
const mongoose = require('mongoose')




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

module.exports = Task