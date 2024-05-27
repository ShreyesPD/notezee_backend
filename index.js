const connectToDB = require('./db')

const express = require('express')
require('dotenv').config()

const app = express()
const port = process.env.PORT

connectToDB();

app.use('/api/auth', require('./routes/authRoutes'))
app.use('/api/notes', require('./routes/notesRoutes'))

app.listen(port, () => {
    console.log(`app listening at port number ${port}`)
})