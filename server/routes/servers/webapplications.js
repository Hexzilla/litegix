const { body } = require('express-validator')
const router = require("express").Router()
const auth = require("../auth")
const webapp = require("../../services/webapp-service")

router.post("/", 
  auth.required, 
  body('serverId').isString(),
  webapp.getWebApplications)

router.post("/create", 
  auth.required, 
  body('name').isString(),
  body('serverId').isString(),
  body('domain').isString(),
  body('owner').isString(),
  body('phpVersion').isString(),
  body('stack').isString(),
  body('sslMethod').isString(),
  webapp.createWebApplication)

module.exports = router
