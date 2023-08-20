require('dotenv').config()
import mongoose, { Schema } from 'mongoose'

const eventSchema = createEventSchema(),
      sessionSchema = createSessionSchema(),
      adminSchema = createAdminSchema()

export default function connectDB() {
  let conn = findConnection()
  
  if (!conn) {
    conn = mongoose.createConnection(process.env.ADMIN_URI)
    conn.model('session', sessionSchema)
    conn.model('admin', adminSchema)
  }

  return conn
}

function createEventSchema() {
  return new Schema({
    _id: {
      type: mongoose.Types.ObjectId,
      required: false
    },
    type: {
      type: String,
      required: true
    },
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

function createSessionSchema() {
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
      type: [eventSchema],
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

function findConnection() {
  return mongoose.connections.find((conn) => conn.name === process.env.ADMIN_DBNAME)
}