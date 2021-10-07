import { Document, Schema, model } from 'mongoose'
import { User } from './user.model'

export interface Channel extends Document {
  channel: string
  name: string
  service: string
  load: number
  memory: number
  content: string
  user: User
}

const ChannelSchema = new Schema<Channel>(
  {
    channel: {
      type: String,
      required: [true, "can't be blank"],
    },
    name: {
      type: String,
      required: [true, "can't be blank"],
    },
    service: {
      type: String,
      required: [true, "can't be blank"],
    },
    load: {
      type: Number,
      required: [false, ''],
    },
    memory: {
      type: Number,
      required: [false, ''],
    },
    content: {
      type: String,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, "can't be blank"],
    },
  },
  {
    toJSON: {
      transform: function (doc, ret) {
        delete ret._id
        delete ret.user
        delete ret.__v
      },
    },
    timestamps: true,
  }
)

export default model<Channel>('Channel', ChannelSchema)
