const { body } = require('express-validator')
const router = require("express").Router()
const auth = require("../auth")
const systemuser = require("../../services/systemuser-service")

router.get("/", auth.required, systemuser.getSystemUsers)

router.post("/create", 
  auth.required, 
  body('name').notEmpty(),
  body('address').isIP(4),
  body('provider').notEmpty(),
  body('web_server').notEmpty(),
  body('database').notEmpty(),
  body('php').notEmpty(),
  systemuser.createSystemUser)

module.exports = router
