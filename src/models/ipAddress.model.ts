import { Document, Schema, model } from 'mongoose'

export interface IPAddress extends Document {
  index: number
  packageName: string
  price: number
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
      type: mongoose.Schema.Types.ObjectId,
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

model<IPAddress>('IPAddress', IPAddressSchema)
