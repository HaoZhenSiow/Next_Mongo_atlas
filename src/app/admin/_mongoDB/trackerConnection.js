require('dotenv').config()
import mongoose, { Schema } from 'mongoose'

export default function createTrackerConnection() {
  const conn = mongoose.createConnection(process.env.TRACKER_MONGO_URI, {
    heartbeatFrequencyMS: 10 * 1000
  })
  const pathSchema = createPathSchema(),
        sessionSchema = createSessionSchema(pathSchema),
        adminSchema = createAdminSchema()

  conn.model('session', sessionSchema)
  conn.model('admin', adminSchema)

  return conn
}

function createPathSchema() {
  return new Schema({
    event: {
      type: String,
      required: true
    },
    duration: {
      type: Number,
      default: 0
    },
    device: {
      type: String
    },
    browser: {
      type: String
    },
    resolution: {
      type: String
    }
  }, { timestamps: true })
}

function createSessionSchema(pathSchema) {
  return new Schema({
    uid: {
      type: mongoose.Types.ObjectId,
      required: true
    },
    ip: {
      type: String,
      required: true
    },
    newUser:{
      type: Boolean,
      required: true
    },
    referrer: {
      type: String,
      required: true
    },
    events: {
      type: [pathSchema],
      required: true
    }
  }, { timestamps: true })
}

function createAdminSchema() {
  return new Schema({
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
}