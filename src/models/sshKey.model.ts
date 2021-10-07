import { Document, Schema, model } from 'mongoose'
import { User } from './user.model'
import { Server } from './server.model'

export interface SSHKey extends Document {
  label: string
  publicKey: string
  user: User
  server: Server
}

const SSHKeySchema = new Schema<SSHKey>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, "can't be blank"],
    },
    server: {
      type: Schema.Types.ObjectId,
      ref: 'Server',
      required: [true, "can't be blank"],
    },
    label: {
      type: String,
      required: [true, "can't be blank"],
    },
    publicKey: {
      type: String,
      required: [true, "can't be blank"],
    },
  },
  {
    timestamps: true,
  }
)

model<SSHKey>('SSHKey', SSHKeySchema)
