import { Document, Schema, model } from 'mongoose'

export interface Explorer extends Document {
  username: string
  password: string
}

const ExplorerSchema = new Schema<Explorer>(
  {
    username: {
      type: String,
      required: [true, "can't be blank"],
    },
    password: {
      type: String,
      required: [true, "can't be blank"],
    },
  },
  {
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id
        delete ret._id
        delete ret.__v
        delete ret.createdAt
        delete ret.updatedAt
      },
    },
    timestamps: true,
  }
)

export default model<Explorer>('Explorer', ExplorerSchema)
