const { body } = require('express-validator')
const router = require("express").Router()
const auth = require("../auth")
const system = require("../../services/system")

router.get("/",
  auth.required,
  system.getSystemUsers)

router.post("/store", 
  auth.required, 
  body('name').isString(),
  body('password').isString(),
  system.storeSystemUser)

  
router.post("/changepassword", 
  auth.required,
  body('id').isString(),
  body('password').isLength({ min: 8 }).trim().escape(),
  system.changeSystemUserPassword)

router.delete("/", 
  auth.required, 
  body('id').isString(),
  system.deleteSystemUser)

module.exports = router
