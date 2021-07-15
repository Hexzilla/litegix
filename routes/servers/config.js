const { body } = require('express-validator')
const router = require("express").Router()
const auth = require("../auth")
const server = require("../../services/server")

router.post("/shell", 
  auth.required, 
  body('address').isIP(4),
  server.getShellCommands)

router.get("/script/:token", server.getScript)

module.exports = router
