import { Document, Schema, model } from 'mongoose'
import { Server } from './server.model'

export interface Supervisor extends Document {
  name: string
  realName: string
  server: Server
}

var SupervisorSchema = new Schema<Supervisor>(
  {
    server: {
      type: Schema.Types.ObjectId,
      ref: 'Server',
    },
    name: {
      type: String,
      required: [true, "can't be blank"],
    },
    userName: {
      type: String,
      required: [true, "can't be blank"],
    },
    numprocs: {
      type: Number,
      required: [true, "can't be blank"],
    },
    vendorBinary: {
      type: String,
      required: [true, "can't be blank"],
    },
    command: {
      type: String,
      required: [true, "can't be blank"],
    },
    autoStart: Boolean,
    autoRestart: Boolean,
    directory: String,
  },
  {
    timestamps: true,
  }
)

model<Supervisor>('Supervisor', SupervisorSchema)
