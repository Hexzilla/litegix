import { Document, Schema, model } from 'mongoose'
import { Application } from './application.model'

export interface PHPScript extends Document {
  application: Application
  name: string
  realName: string
}

var PHPScriptSchema = new Schema<PHPScript>(
  {
    application: {
      type: Schema.Types.ObjectId,
      ref: 'Application',
    },
    name: {
      type: String,
      required: [true, "can't be blank"],
    },
    realName: {
      type: String,
      required: [true, "can't be blank"],
    },
  },
  {
    timestamps: false,
  }
)

export default model<PHPScript>('PHPScript', PHPScriptSchema)
