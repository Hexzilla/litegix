import { Document, Schema, model } from 'mongoose'
import { User } from './user.model'

export interface SystemStatus {
  kernelVersion: string
  processorName: string
  totalCPUCore: number
  totalMemory: number
  freeMemory: number
  diskTotal: number
  diskFree: number
  loadAvg: number
  uptime: string
}

export interface Installation {
  status: string
  message: string
  progress: number
}

export interface Server extends Document {
  name: string
  address: string
  provider: string
  webserver: string
  database: string
  phpVersion: string
  connected: boolean
  system: SystemStatus
  userEmail: string
  securityId: string
  securityKey: string
  installation: Installation
  user: User
  toSummaryJSON(): JSON
}

const ServerSchema = new Schema<Server>(
  {
    name: {
      type: String,
      required: [true, "can't be blank"],
    },
    address: {
      type: String,
      required: [true, "can't be blank"],
    },
    provider: String,
    webserver: String,
    database: String,
    phpVersion: String,
    connected: Boolean,
    system: {
      kernelVersion: String,
      processorName: String,
      totalCPUCore: Number,
      totalMemory: Number,
      freeMemory: Number,
      diskTotal: Number,
      diskFree: Number,
      loadAvg: Number,
      uptime: String,
    },
    userEmail: {
      type: String,
      required: [false, 'must email formating'],
    },
    securityId: String,
    securityKey: String,
    SSHConfig: {
      Passwordless_Login_Only: { type: Boolean },
      Prevent_root_login: { type: Boolean },
      UseDNS: { type: Boolean },
    },
    AutoUpdate: {
      Third_Party_Software_Update: { type: Boolean },
      Security_Update: { type: Boolean },
    },
    installation: {
      status: String,
      message: String,
      progress: Number,
    },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
    autoIndex: false,
  }
)

ServerSchema.index({ name: 1, type: -1 }) // schema level

ServerSchema.methods.toSummaryJSON = function () {
  return this.system
}

export default model<Server>('Server', ServerSchema)
