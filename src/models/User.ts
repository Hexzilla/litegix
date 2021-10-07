import { Document, Schema, model } from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import { secret } from 'config'

interface User extends Document {
  username: string
  email: string
  avatar?: string
  bio: string
  image: string
  hash: string
  salt: string
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
    favorites: [{ type: Schema.Types.ObjectId, ref: 'Article' }],
    following: [{ type: Schema.Types.ObjectId, ref: 'User' }],
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

UserSchema.plugin(uniqueValidator, { message: 'is already taken.' })

UserSchema.methods.validPassword = function (password) {
  var hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, 'sha512')
    .toString('hex')
  return this.hash === hash
}

UserSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString('hex')
  this.hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, 'sha512')
    .toString('hex')
}

UserSchema.methods.generateJWT = function () {
  var today = new Date()
  var exp = new Date(today)
  exp.setDate(today.getDate() + 60)

  return jwt.sign(
    {
      id: this._id,
      username: this.username,
      exp: parseInt(exp.getTime() / 1000),
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

model('User', UserSchema)
