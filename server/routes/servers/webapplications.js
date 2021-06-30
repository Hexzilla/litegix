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
  body('serverId').isString(),
  body('name').isString(),
  body('domain').isString(),
  body('owner').isString(),
  body('phpVersion').isString(),
  body('stack').isString(),
  body('sslMethod').isString(),
  webapp.createWebApplication)

router.delete("/", 
  auth.required, 
  body('serverId').isString(),
  body('name').isString(),
  webapp.deleteWebApplication)

module.exports = router
