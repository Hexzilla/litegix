import { Document, Schema, model } from 'mongoose'
import { User } from './user.model'

export type DNSType = 'A' | 'B'

export type TTLMode = 'Auto'

export type ProxyStatus = 'DNS Only'

export interface DNS extends Document {
  type: DNSType
  hostname: string
  content: string
  ttl: TTLMode
  proxyStatus: ProxyStatus
  user: User
}

const DNSSchema = new Schema<DNS>(
  {
    type: {
      type: String,
      required: [true, "can't be blank"],
    },
    hostname: {
      type: String,
      required: [true, "can't be blank"],
    },
    content: {
      type: String,
      required: [true, "can't be blank"],
    },
    ttl: {
      type: String,
      required: [true, "can't be blank"],
    },
    proxyStatus: {
      type: String,
      required: [true, "can't be blank"],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id
        delete ret.user
        delete ret._id
        delete ret.__v
      },
    },
    timestamps: false,
  }
)

export default model<DNS>('DNS', DNSSchema)
