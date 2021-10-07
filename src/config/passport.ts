import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { model } from 'mongoose'
import { User } from 'models'
const UserModel = model<User>('User')

passport.use(
  'signup',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      console.log('this is passport signup')
      try {
        const find = await UserModel.findOne({ email: req.body.email })

        if (find) {
          return done(null, null)
        }
        const username = req.body.name
        const user = await UserModel.create({ username, email })
        user.setPassword(password)
        user.save()
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
    function (email, password, done) {
      UserModel.findOne({ email: email })
        .then((user: User | null) => {
          if (!user || !user.validPassword(password)) {
            return done(
              {
                errors: { message: 'Email or password is invalid' },
              },
              null
            )
          }

          return done(null, user)
        })
        .catch(done)
    }
  )
)
