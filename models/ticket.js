const mongoose = require('mongoose')

const ticketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    state: {
        type: String,
        required: true,
        default: "Open"
    }
})

module.exports = mongoose.model('Ticket', ticketSchema)