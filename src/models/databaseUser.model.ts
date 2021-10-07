import { Document, Schema, model } from 'mongoose'
import { Server } from './server.model'

export interface DatabaseUser extends Document {
  name: string
  password: string
  server: Server
}

const DatabaseUserSchema = new Schema<DatabaseUser>(
  {
    name: {
      type: String,
      required: [true, "can't be blank"],
    },
    password: {
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
        delete ret.__v
        delete ret.server
      },
    },
    timestamps: false,
  }
)

model<DatabaseUser>('DatabaseUser', DatabaseUserSchema)
