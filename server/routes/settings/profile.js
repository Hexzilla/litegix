const { body } = require('express-validator')
const router = require("express").Router()
const auth = require("../auth")
const profile = require("../../services/profile")

router.get("/", auth.required, profile.getProfile)

// Upate user profile
router.post("/update", 
  auth.required,
  body('email').isEmail(),
  body('name').isLength({ min: 3, max: 20 }).trim().escape(),
  body('timezone').isNumeric(),
  profile.updateProfile)

// Update company info
router.post("/updatecompany", 
  auth.required,
  body('name').isLength({ min: 3, max: 20 }).isFQDN().trim().escape(),
  body('address1').notEmpty(),
  body('city').notEmpty(),
  body('postal').isNumeric(),
  body('state').notEmpty(),
  body('country').notEmpty(),
  body('tax').isNumeric(),
  profile.updateCompany)

module.exports = router
