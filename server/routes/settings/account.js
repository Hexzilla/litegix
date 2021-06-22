const { body } = require('express-validator')
const router = require("express").Router()
const auth = require("../auth")
const AccountService = require("../../services/account-service")

// Upate user profile
router.post("/password/update", 
  auth.required,
  body('current_password').notEmpty(),
  body('password').isLength({ min: 8 }),
  body('password_confirm').notEmpty(),
  AccountService.changePassword)


module.exports = router
