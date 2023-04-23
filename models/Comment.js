const { Schema, model } = require("mongoose");



const commentSchema = Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: false
    },
    comment: {
        type: String,
        required: true
    },
    allow: {
        type: Boolean,
        required: true,
        default: false
    },
    date:  {
        type: Date, default: Date.now()
    },
    allowed: {
        type: Boolean,
        required: true,
        default: false
    }
})

module.exports = model('Comment', commentSchema)