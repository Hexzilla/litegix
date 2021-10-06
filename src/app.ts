import http from 'http'
import express, { Request, Response, NextFunction } from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import methodOverride from 'method-override'
import morgan from 'morgan'
import path from 'path'
import favicon from 'serve-favicon'
import session from 'express-session'
import mongoose from 'mongoose'
import routes from './routes'

// methods = require("methods"),
// errorhandler = require("errorhandler"),
// useragent = require("express-useragent");

require('dotenv').config()
const isProduction = process.env.NODE_ENV === 'production'

// Create global app object
const app = express()

app.use(cors())

// Normal express config defaults
app.use(morgan('dev'))
app.use(express.json())
app.use(
  express.urlencoded({
    extended: true,
  })
)

app.use(useragent.express())
app.use(methodOverride())
app.use(express.static(__dirname + '/public'))
app.use(favicon(path.join(__dirname, '../public', 'favicon.png')))

const secret = isProduction ? process.env.SECRET : 'litegix.debug'
app.use(
  session({
    secret: secret,
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false,
  })
)

if (!isProduction) {
  app.use(errorhandler())
}

mongoose.set('useNewUrlParser', true)
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)
mongoose.set('useUnifiedTopology', true)

if (isProduction) {
  mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true })
} else {
  mongoose.connect('mongodb://localhost/litegix', { useNewUrlParser: true })
  mongoose.set('debug', true)
}

require('models')
require('config/passport')

//require('./migrations/country')()
//require('./migrations/credittopup')()

app.use(routes)

/// catch 404 and forward to error handler
app.use(function (req: Request, res: Response, next: NextFunction) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

/// error handlers

// development error handler
// will print stacktrace
if (!isProduction) {
  app.use((err: any, req: Request, res: Response) => {
    console.log(err.stack)

    res.status(err.status || 500)

    res.json({
      errors: {
        message: err.message,
        error: err,
      },
    })
  })
}

// production error handler
// no stacktraces leaked to user
app.use((err: any, req: Request, res: Response) => {
  res.status(err.status || 500)
  res.json({
    errors: {
      message: err.message,
      error: {},
    },
  })
})

// get the unhandled rejection and throw it to another fallback handler we already have.
process.on('unhandledRejection', (reason, promise) => {
  throw reason
})

process.on('uncaughtException', (err) => {
  console.error('There was an uncaught error', err)
  process.exit(1) //mandatory (as per the Node.js docs)
})

// finally, let's start our server...
app.listen(process.env.PORT || 3000, () => {
  console.log('Server is listening')
})
