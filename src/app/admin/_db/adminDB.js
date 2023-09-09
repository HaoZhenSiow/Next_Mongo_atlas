require('dotenv').config()
import mongoose, { Schema } from 'mongoose'
import setupMongoDB from 'setup-mongodb'

const uri = process.env.ADMIN_URI

const eventSchema = createEventSchema(),
      sessionSchema = createSessionSchema(),
      adminSchema = createAdminSchema()

const schemas = {
  admin: adminSchema,
  session: sessionSchema
}

const connectDB = setupMongoDB(uri, schemas)

export default connectDB

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
    devices: {
      type: Map,
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