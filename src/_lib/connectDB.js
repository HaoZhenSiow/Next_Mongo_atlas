require('dotenv').config()
import mongoose from 'mongoose'

const connectDB = async () => {
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(process.env.MONGO_URI)
  }
}

export default connectDB