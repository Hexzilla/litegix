const { body } = require('express-validator')
const router = require("express").Router()
const auth = require("../auth")
const application = require("../../services/application-service")

router.post("/", 
  auth.required, 
  body('serverId').isString(),
  application.getWebApplications)

router.post("/create", 
  auth.required,
  body('serverId').isString(),
  body('name').isString(),
  body('domain').isString(),
  body('owner').isString(),
  body('phpVersion').isString(),
  body('stack').isString(),
  body('sslMethod').isString(),
  application.createWebApplication)

router.delete("/", 
  auth.required, 
  body('serverId').isString(),
  body('name').isString(),
  application.deleteWebApplication)

module.exports = router
