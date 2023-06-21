const express = require('express')
const cors = require('cors')
const { dbConnection } = require('./database/config')
require('dotenv').config()

const fileUpload =  require('express-fileupload')



//Create server - app Express
const app = express()

//Public access
app.use( express.static('public'))


//DB

dbConnection()

//CORS

app.use(cors())

//Body (read and parse)
app.use(express.json())



//file upload
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: './temp-upload/'
}))


//RUTAS
app.use('/auth', require('./routes/auth'))
app.use('/project', require('./routes/project'))
app.use('/blog', require('./routes/blog'))
app.use('/comment', require('./routes/comment'))
app.use('/contact', require('./routes/contact'))
app.use('/utils', require('./routes/utils'))




app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${ process.env.PORT }`)
})

