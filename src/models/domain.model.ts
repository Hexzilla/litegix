import { Document, Schema, model } from 'mongoose'
import { Webapp } from './webapp.model'

export interface Domain extends Document {
  name: string
  type: string
  www: boolean
  redirection: boolean
  wildcard: boolean
  dnsIntegration: string
  status: string
  webapp: Webapp
}

const DomainSchema = new Schema<Domain>(
  {
    name: {
      type: String,
      required: [true, "can't be blank"],
    },
    type: {
      type: String,
      required: [true, "can't be blank"]
    },
    www: {
      type: Boolean,
      default: false
    },
    redirection: {
      type: Boolean,
      default: false
    },
    wildcard: {
      type: Boolean,
      default: false
    },
    dnsIntegration: String,
    status: String,
    webapp: {
      type: Schema.Types.ObjectId,
      ref: 'Webapp',
    },
  },
  {
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id
        delete ret._id
        delete ret.__v
      },
    },
    timestamps: false,
  }
)

export default model<Domain>('Domain', DomainSchema)
