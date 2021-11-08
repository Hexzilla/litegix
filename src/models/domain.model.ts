import { Document, Schema, model } from 'mongoose'
import { Webapp } from './webapp.model'

export interface Domain extends Document {
  name: string
  rootPath: string
  webapp: Webapp
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
    webapp: {
      type: Schema.Types.ObjectId,
      ref: 'Webapp',
    },
  },
  {
    timestamps: false,
  }
)

export default model<Domain>('Domains', DomainSchema)
