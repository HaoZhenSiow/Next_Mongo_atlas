require('dotenv').config()
import mongoose, { Schema } from 'mongoose'

const pathSchema = createPathSchema(),
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

function findConnection() {
  return mongoose.connections.find((conn) => conn.name === process.env.ADMIN_DBNAME)
}