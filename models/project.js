const { model, Schema, default: mongoose } = require('mongoose')


const projectSchema = Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    github: {
        type: String,
        required: false
    },
    url: {
        type: String,
        required: false
    },
    video: {
        type: String,
        required: false
    },
    more: {
        type: String,
        required: false
    },
    image: {
        public_id: String,
        secure_url: String
    },
    date:  {
        type: Date, default: new Date()
    },
})


module.exports = mongoose.model('Project', projectSchema)

