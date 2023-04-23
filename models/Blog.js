const { Schema, model } = require('mongoose')

var postSchema = Schema({
    title: {
        type: String,
        required: true
    },
    intro: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    url: {
        type: String
    },
    author: {
        type: String,
        required: false
    },
    date: {
        type: Date,
        default: Date.now
    },
    image: {
        public_id: String,
        secure_url: String
    }
})


module.exports = model('Post', postSchema)