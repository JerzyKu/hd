const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    isActive: {
        type: Boolean,
        required: true,
        default: true
    },
    name: {
        type: String
    },
    surname: {
        type: String
    }, 
    title: {
        type: String
    }
})

module.exports = mongoose.model('user', userSchema)