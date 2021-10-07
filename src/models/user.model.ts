import { Document, Schema, model } from 'mongoose'
//import uniqueValidator from 'mongoose-unique-validator'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import secret from 'config'
import { Company } from './company.model'

export interface APIKeys {
  enableAccess: boolean
  apiKey: string
  secretKey: string
}
export interface Newsletters {
  subscription: boolean
  announchment: boolean
  blog: boolean
  events: boolean
}

export interface User extends Document {
  username: string
  email: string
  bio: string
  image: string
  hash: string
  salt: string
  timezone: string
  ip_enable: boolean
  loginNotification: boolean
  company: Company
  newsletters: Newsletters
  apiKeys: APIKeys
  generateJWT(): string
  setPassword(password: string): void
  validPassword(password: string): boolean
  toAuthJSON(): JSON
  toProfileJSON(): JSON
}

const UserSchema = new Schema<User>(
  {
    username: {
      type: String,
      unique: true,
      required: [true, "can't be blank"],
      match: [/^[a-zA-Z0-9]+$/, 'is invalid'],
      index: true,
    },
    email: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, "can't be blank"],
      match: [/\S+@\S+\.\S+/, 'is invalid'],
      index: true,
    },
    ip_enable: { type: Boolean },
    verify: {
      code: String,
      validat_time: String,
      url: String,
    },
    bio: String,
    image: String,
    hash: String,
    salt: String,
    timezone: String,
    loginNotification: Boolean,

    newsletters: {
      subscription: Boolean,
      announchment: Boolean,
      blog: Boolean,
      events: Boolean,
    },
    apiKeys: {
      enableAccess: { type: Boolean, default: false },
      apiKey: String,
      secretKey: String,
    },
    company: { type: Schema.Types.ObjectId, ref: 'Company' },
  },
  { timestamps: true }
)

//UserSchema.plugin(uniqueValidator, { message: 'is already taken.' })

UserSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString('hex')
  this.hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, 'sha512')
    .toString('hex')
}

UserSchema.methods.validPassword = function (password) {
  var hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, 'sha512')
    .toString('hex')
  return this.hash === hash
}

UserSchema.methods.generateJWT = function () {
  const today = new Date()
  const exp = new Date(today)
  exp.setDate(today.getDate() + 60)

  return jwt.sign(
    {
      id: this._id,
      username: this.username,
      exp: exp.getTime() / 1000,
    },
    secret
  )
}

UserSchema.methods.toAuthJSON = function () {
  return {
    username: this.username,
    email: this.email,
    token: this.generateJWT(),
    bio: this.bio,
    image: this.image,
  }
}

UserSchema.methods.toJSON = function () {
  return {
    username: this.username,
    email: this.email,
    timezone: this.timezone,
    loginNotification: this.loginNotification,
  }
}

UserSchema.methods.toProfileJSON = function () {
  return {
    user: this.toJSON(),
    company: this.company ? this.company.toJSON() : {},
  }
}

export default model<User>('User', UserSchema)
