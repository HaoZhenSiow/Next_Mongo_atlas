import { Schema, model, models } from 'mongoose'

const adminModel = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
}, { timestamps: true })

module.exports = models.admin ? model('admin') : model('admin', adminModel)