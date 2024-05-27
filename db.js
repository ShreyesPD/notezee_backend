const mongoose = require('mongoose')
// import mongoose from 'mongoose'

const mongoURI = "mongodb://localhost:27017/"

const connectToDB = async () => {
    await mongoose.connect(mongoURI)
    console.log("connected to db successfully")
}

module.exports = connectToDB;
// export { connectToDB }