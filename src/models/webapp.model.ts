import { Document, Schema, model } from 'mongoose'
import { Server } from './server.model'
import { SystemUser } from './systemUser.model'
import { Domain } from './domain.model'

export interface Wordpress {
  adminName: string
  adminPassword: string
  adminEmail: string
  databaseUser: string
  databasePassword: string
  databaseName: string
  tablePrefix: string
}
export interface GitRepository {
  provider: string
  githost: string
  repository: string
  branch: string
}
export interface Webapp extends Document {
  name: string
  rootPath: string
  server: Server
  owner: SystemUser
  domains: Array<Domain>
  domainType: string
  domainName: string
  git: GitRepository
  wordpress: Wordpress
}

var WebappSchema = new Schema<Webapp>(
  {
    server: {
      type: Schema.Types.ObjectId,
      ref: 'Server',
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'SystemUser',
    },
    webType: {
      type: String,
      required: [true, "can't be blank"],
    },
    name: {
      type: String,
      required: [true, "can't be blank"],
    },
    domains: [{
      type: Schema.Types.ObjectId,
      ref: 'Domain'
    }],
    domainType: {
      type: String,
      required: [true, "can't be blank"],
    },
    domainName: {
      type: String,
      required: [true, "can't be blank"],
    },
    enableW3Version: {
      type: Boolean,
      required: [true, "can't be blank"],
    },
    publicPath: {
      type: String,
    },
    phpVersion: {
      type: String,
      required: [true, "can't be blank"],
    },
    webAppStack: {
      // "hybrid", "nativenginx", or "customnginx"
      type: String,
      required: [true, "can't be blank"],
    },
    stackMode: {
      //"production" or "development"
      type: String,
    },
    sslMode: {
      type: String,
      required: [true, "can't be blank"],
    },
    enableAutoSSL: {
      type: Boolean,
      required: [true, "can't be blank"],
    },
    /*pullKey1: {
      type: String,
      required: [true, "can't be blank"],
    },
    pullKey2: {
      type: String,
      required: [true, "can't be blank"],
    },*/
    advancedSSL: {
      advancedSSL: { type: Boolean, default: false },
      autoSSL: { type: Boolean, default: false },
    },
    settings: {
      disableFunctions: String,
      timezone: String,
      maxExecutionTime: Number,
      maxInputTime: Number,
      maxInputVars: Number,
      memoryLimit: Number,
      postMaxSize: Number,
      uploadMaxFilesize: Number,
      allowUrlFopen: Boolean,
      sessionGcMaxlifetime: Number,
      processManager: String, //"dynamic", "ondemand", or "static"
      processManagerStartServers: Number, //REQUIRED IF PROCESSMANAGER IS "DYNAMIC"
      processManagerMinSpareServers: Number, //REQUIRED IF PROCESSMANAGER IS "DYNAMIC"
      processManagerMaxSpareServers: Number, //REQUIRED IF PROCESSMANAGER IS "DYNAMIC"
      processManagerMaxChildren: Number,
      processManagerMaxRequests: Number,
      openBasedir: String,
      clickjackingProtection: Boolean,
      xssProtection: Boolean,
      mimeSniffingProtection: Boolean,
    },
    wordpress: {
      adminUserName: {
        type: String,
        required: [true, "can't be blank"],
      },
      adminPassword: {
        type: String,
        required: [true, "can't be blank"],
      },
      adminEmail: {
        type: String,
        required: [true, "can't be blank"],
      },
      databaseUser: String,
      databasePassword: String,
      databaseName: String,
      tablePrefix: String,
    },
    git: {
      provider: String,
      githost: String,
      repository: String,
      branch: String,
    },
  },
  {
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id
        delete ret._id
        delete ret.server
        delete ret.__v
      },
    },
    timestamps: false,
  }
)

export default model<Webapp>('Webapp', WebappSchema)
