import { Document, Schema, model } from 'mongoose'
import { Server } from './server.model'

export interface CronJob extends Document {
  label: string
  username: string
  time: string
  command: string
  vendor_binary: string
  predef_setting: string
  server: Server
}

const CronJobSchema = new Schema<CronJob>(
  {
    label: {
      type: String,
      required: [true, "can't be blank"],
    },
    username: {
      type: String,
      required: [true, "can't be blank"],
    },
    time: {
      type: String,
      required: [true, "can't be blank"],
    },
    command: {
      type: String,
      required: [true, "can't be blank"],
    },
    vendor_binary: {
      type: String,
      required: [true, "can't be blank"],
    },
    predef_setting: {
      type: String,
      required: [true, "can't be blank"],
    },
    server: {
      type: Schema.Types.ObjectId,
      ref: 'Server',
    },
  },
  {
    toJSON: {
      transform: function (doc, ret) {
        delete ret._id
        delete ret.__v
        delete ret.server
      },
    },
    timestamps: true,
  }
)

model<CronJob>('CronJob', CronJobSchema)
