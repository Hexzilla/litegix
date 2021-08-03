var passport = require("passport")
var LocalStrategy = require("passport-local").Strategy
var mongoose = require("mongoose")
var User = mongoose.model("User")

passport.use(
  "signup",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true
    },
    async (req, email, password, done) => {
      console.log('this is passport signup');
      try {
        find = await User.findOne({email: req.body.email})

        if(find)
        {
          return done(null, null)
        }
        const username = req.body.name
        const user = await User.create({ username, email })
        user.setPassword(password)
        user.save()
        return done(null, user)
      } 
      catch (error) {
        done(error)
      }
    }
  )
)

passport.use(
  "login",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    function (email, password, done) {
      User.findOne({ email: email })
        .then(function (user) {
          if (!user || !user.validPassword(password)) {
            return done(null, false, {
              errors: { "email or password": "is invalid" },
            })
          }

          return done(null, user)
        })
        .catch(done)
    }
  )
)
