const { body } = require('express-validator')
const mongoose = require("mongoose")
const router = require("express").Router()
const User = mongoose.model("User")
const auth = require("../auth")
const ProfileService = require("../../services/profile-service")

router.get("/", auth.required, ProfileService.getProfile)

// Upate user profile
router.post("/update", 
  auth.required,
  body('email').isEmail(),
  body('name').isLength({ min: 3, max: 20 }).trim().escape(),
  body('timezone').isNumeric(),
  ProfileService.updateProfile)

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
  ProfileService.updateCompany)

module.exports = router
