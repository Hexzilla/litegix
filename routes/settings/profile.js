const { body } = require('express-validator')
const router = require("express").Router()
const auth = require("../auth")
const profile = require("../../services/profile")

router.post("/", auth.required, profile.getProfile)

// Upate user profile
router.post("/update", 
  auth.required,
  body('email').isEmail(),
  body('name').isLength({ min: 3, max: 20 }).trim().escape(),
  body('timezone').isString(),
  body('loginNotification').isBoolean(),
  profile.updateProfile)

// Update company info
router.post("/updatecompany", 
  auth.required,
  body('name').isLength({ min: 3, max: 100 }).trim().escape(),  //.isFQDN()
  body('address1').notEmpty(),
  body('address2').notEmpty(),
  body('city').notEmpty(),
  body('postal').isNumeric(),
  body('state').notEmpty(),
  body('country').notEmpty(),
  body('tax').isNumeric(),
  profile.updateCompany)

module.exports = router
