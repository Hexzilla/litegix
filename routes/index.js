const { body } = require('express-validator')
const router = require('express').Router();
const authService = require('../services/auth')

router.use('/api', require('./api'));
router.use('/settings', require('./settings'));
router.use('/servers', require('./servers'));
router.use('/subscriptions', require('./subscriptions')); 
router.use('/payment', require('./payment')); 

router.post('/login', 
  body('email').notEmpty(),
  body('password').notEmpty(),
  authService.login);

router.post('/signup', 
  body('name').notEmpty(),
  body('email').notEmpty(),
  body('password').notEmpty(),
  authService.signup);

router.use(function (err, req, res, next) {
  if (err.name === "ValidationError") {
    return res.status(422).json({
      errors: Object.keys(err.errors).reduce(function (errors, key) {
        errors[key] = err.errors[key].message

        return errors
      }, {}),
    })
  }

  return next(err)
})

/*const cryptoService = require('../services/crypto')
const encrypted = cryptoService.encrypt("Hello World. www.maazone.com!!!192020$$$###")
const decrypted = cryptoService.decrypt(encrypted)
console.log('crypto', encrypted, decrypted)*/

module.exports = router;
