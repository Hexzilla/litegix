const { body } = require('express-validator')
const router = require("express").Router()
const auth = require("../auth")
const authService = require("../../services/auth-service")

// Upate user profile
router.post("/password/update", 
  auth.required,
  body('current_password').isString(),
  body('password').isString().isLength({ min: 8 }),
  body('password_confirm').matches('password').withMessage('Passwords must match.'),
  authService.changePassword)

router.delete("/", 
  auth.required,
  authService.deleteAccount)

module.exports = router
