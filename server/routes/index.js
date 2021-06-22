const router = require('express').Router();
const authService = require('../services/auth-service')

router.use('/api', require('./api'));
router.use('/settings', require('./settings'));
router.use('/servers', require('./servers'));
router.use('/installation', require('./installation'));

router.post('/login', authService.login);
router.post('/signup', authService.signup);

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

module.exports = router;
