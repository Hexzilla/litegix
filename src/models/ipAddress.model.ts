import { Document, Schema, model } from 'mongoose'
import { User } from './user.model'
export interface IPAddress extends Document {
  index: number
  packageName: string
  price: number
  user: User
}

const IPAddressSchema = new Schema<IPAddress>(
  {
    address: {
      type: String,
      required: true,
      unique: true,
    },
    desc: String,
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    toJSON: {
      transform: function (doc, ret) {
        delete ret._id
        delete ret.__v
      },
    },
    timestamps: true,
  }
)

export default model<IPAddress>('IPAddress', IPAddressSchema)
