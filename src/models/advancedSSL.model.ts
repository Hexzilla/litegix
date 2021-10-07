import { Document, Schema, model } from 'mongoose'
import { IApplication } from './application.model'
import { IDomain } from './domain.model'

export interface AdvancedSSL extends Document {
  method: string
  enableHttp: boolean
  enableHsts: boolean
  application: IApplication
  domain: IDomain
}

const AdvancedSSLSchema = new Schema<AdvancedSSL>(
  {
    method: {
      type: String,
      required: [true, "can't be blank"],
    },
    enableHttp: {
      type: Boolean,
      required: [true, "can't be blank"],
    },
    enableHsts: {
      type: Boolean,
      required: [true, "can't be blank"],
    },
    ssl_protocol_id: Number,

    staging: {
      type: Boolean,
      default: false,
    },
    api_id: Number,
    validUntil: Date,
    renewalDate: Date,

    authorizationMethod: String,
    externalApi: Number,
    environment: String,

    privateKey: String,
    certificate: String,

    csrKeyType: String,
    organization: String,
    department: String,
    city: String,
    state: String,
    country: String,
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application',
    },
    domain: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Domains',
    },
  },
  {
    timestamps: false,
  }
)

model<AdvancedSSL>('AdvancedSSL', AdvancedSSLSchema)
