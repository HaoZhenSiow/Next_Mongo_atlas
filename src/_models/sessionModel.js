import mongoose, { Schema, model, models } from 'mongoose'

const sessionSchema = new Schema({
  uid: {
    type: mongoose.Types.ObjectId,
    required: true,
    unique: true
  },
  path: {
    type: String,
    required: true
  },
  ip: {
    type: String,
    required: true
  }
}, { timestamps: true })

module.exports = models.session ? model('session') : model('session', sessionSchema)