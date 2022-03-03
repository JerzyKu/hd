const mongoose = require('mongoose')

const ticket_statusSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Ticket', ticket_statusSchema)