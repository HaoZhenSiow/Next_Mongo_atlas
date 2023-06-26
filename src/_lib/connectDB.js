require('dotenv').config()
const mongoose = require('mongoose')

export const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI)
}

export const disconnectDB = async () => {
  await mongoose.connection.close()
}