const { body } = require('express-validator')
const router = require("express").Router()
const auth = require("../auth")
const system = require("../../services/system-service")

router.get("/", auth.required, system.getSystemUsers)

router.post("/create", 
  auth.required, 
  body('name').isString(),
  body('password').isString(),
  system.createSystemUser)

router.delete("/", 
  auth.required, 
  body('name').notEmpty(),
  system.deleteSystemUser)

module.exports = router
