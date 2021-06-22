const { body } = require('express-validator')
const router = require("express").Router()
const auth = require("../auth")
const server = require("../../services/server-service")

router.post("/create", 
  auth.required, 
  body('name').notEmpty(),
  body('provider').notEmpty(),
  body('address').isIP(4),
  body('web_server').notEmpty(),
  body('database').notEmpty(),
  body('php').notEmpty(),
  server.create)


module.exports = router
