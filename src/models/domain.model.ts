import { Document, Schema, model } from 'mongoose'
import { Application } from './application.model'

export interface Domain extends Document {
  name: string
  rootPath: string
  application: Application
}

const DomainSchema = new Schema<Domain>(
  {
    name: {
      type: String,
      required: [true, "can't be blank"],
    },
    type: { type: String, required: [true, "can't be blank"] },
    www: { type: Boolean, default: true },
    redirection: String,
    wildcard: { type: Boolean, default: false },
    dns_integration: String,
    status: String,
    application: {
      type: Schema.Types.ObjectId,
      ref: 'Application',
    },
  },
  {
    timestamps: false,
  }
)

model<Domain>('Domains', DomainSchema)
