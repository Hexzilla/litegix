const { body } = require('express-validator')
const router = require("express").Router()
const auth = require("../auth")
const server = require("../../services/server")

router.get("/", auth.required, server.getServers)

router.post("/store", 
  auth.required, 
  body('name').notEmpty(),
  body('address').isIP(4),
  body('provider').notEmpty(),
  body('web_server').notEmpty(),
  body('database').notEmpty(),
  body('phpVersion').notEmpty(),
  server.storeServer)

module.exports = router
