import { Document, Schema, model } from 'mongoose'
import { Webapp } from './webapp.model'

export type DomainType = 'primay' | 'atlas'

export enum PreferedDomain {
  NOWN,
  WWW,
  NON_WWW,
}

export interface Domain extends Document {
  name: string
  type: DomainType
  www: boolean
  preferedDomain?: PreferedDomain
  dnsIntegration?: string
  status?: string
  webapp?: Webapp
}

const DomainSchema = new Schema<Domain>(
  {
    name: {
      type: String,
      required: [true, "can't be blank"],
    },
    type: {
      type: String,
      required: [true, "can't be blank"],
    },
    www: {
      type: Boolean,
      default: false,
    },
    preferedDomain: {
      type: Number,
      default: false,
    },
    dnsIntegration: {
      type: String,
      default: false,
    },
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
