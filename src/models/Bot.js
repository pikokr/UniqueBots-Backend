const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    approved: {
        type: Boolean,
        default: false
    },
    tag: {
        type: String,
        required: false,
        default: null
    },
    brief: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
})

const Bot = mongoose.model('bot', schema, 'bots')

module.exports = Bot