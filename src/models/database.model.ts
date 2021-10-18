import { Document, Schema, model } from 'mongoose'
import { DatabaseUser } from './databaseUser.model'
import { Server } from './server.model'

export interface Database extends Document {
  name: string
  collation?: string
  user: DatabaseUser
  server: Server
}

const DatabaseSchema = new Schema<Database>(
  {
    name: {
      type: String,
      required: [true, "can't be blank"],
    },
    collation: {
      type: String,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'DatabaseUser',
    },
    server: {
      type: Schema.Types.ObjectId,
      ref: 'Server',
    },
  },
  {
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id
        delete ret._id
        delete ret.__v
        delete ret.server
      },
    },
    timestamps: false,
  }
)

export default model<Database>('Database', DatabaseSchema)
