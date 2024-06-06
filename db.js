const mongoose = require('mongoose')
// import mongoose from 'mongoose'
require('dotenv').config()


const mongoURI = process.env.mongo_uri
// const mongoURI = "mongodb://localhost:27017/"
const connectToDB = async () => {
    await mongoose.connect(mongoURI)
    console.log("connected to db successfully")
}

module.exports = connectToDB;
// export { connectToDB }