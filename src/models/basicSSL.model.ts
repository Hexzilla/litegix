import { Document, Schema, model } from 'mongoose'

export interface BasicSSL extends Document {
  method: string
  enableHttp: boolean
  enableHsts: boolean
}

const BasicSSLSchema = new Schema<BasicSSL>(
  {
    application: {
      type: Schema.Types.ObjectId,
      ref: 'Application',
    },

    method: { type: String, required: [true, "can't be blank"] },
    enableHttp: { type: Boolean, required: [true, "can't be blank"] },
    enableHsts: { type: Boolean, required: [true, "can't be blank"] },
    ssl_protocol_id: Number,

    staging: { type: Boolean, default: false },
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
  },
  {
    timestamps: false,
  }
)

model<BasicSSL>('BasicSSL', BasicSSLSchema)
