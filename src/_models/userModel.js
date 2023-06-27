import { Schema, model, models } from 'mongoose'

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
}, { timestamps: true })

module.exports = models.user ? model('user') : model('user', userSchema)