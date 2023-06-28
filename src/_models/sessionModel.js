import mongoose, { Schema, model, models } from 'mongoose'

const pathSchema = new Schema({
  event: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    default: 0
  }
}, { timestamps: true })

const sessionSchema = new Schema({
  uid: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  ip: {
    type: String,
    required: true
  },
  path: {
    type: [pathSchema],
    required: true
  }
}, { timestamps: true })

module.exports = models.session ? model('session') : model('session', sessionSchema)