const { body } = require('express-validator')
const router = require("express").Router()
const auth = require("../auth")
const server = require("../../services/server-service")

router.get("/", auth.required, server.getServers)

router.post("/create", 
  auth.required, 
  body('name').notEmpty(),
  body('address').isIP(4),
  body('provider').notEmpty(),
  body('web_server').notEmpty(),
  body('database').notEmpty(),
  body('php').notEmpty(),
  server.create)

router.get("/script", auth.required, server.getShellCommand)

router.get("/script/:token", server.getScript)

module.exports = router
