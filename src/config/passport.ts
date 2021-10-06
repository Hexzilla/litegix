import { Request } from 'express'
import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { findUserByEmail, createUser, verifyPassword } from 'models/User'

passport.use(
  'signup',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    },
    async (req: Request, email: string, password: string, done) => {
      console.log('passport signup', email, password)
      try {
        let user = await findUserByEmail(email)
        if (user) {
          return done(null, null)
        }
        user = await createUser({
          email,
          name: req.body.name,
          password,
        })
        return done(null, user)
      } catch (error) {
        done(error)
      }
    }
  )
)

passport.use(
  'login',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email: string, password: string, done) => {
      const user = await findUserByEmail(email)
      if (!user || !verifyPassword(user, password)) {
        return done('Email or password is invalid')
      }
      return done(null, user)
    }
  )
)
