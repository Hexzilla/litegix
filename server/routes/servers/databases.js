const { body } = require('express-validator')
const router = require("express").Router()
const auth = require("../auth")
const application = require("../../services/application-service")

router.post("/", 
  auth.required, 
  body('serverId').isString(),
  application.getDatabases)

router.post("/create", 
  auth.required, 
  body('serverId').isString(),
  body('name').isString(),
  body('encoding').isString(),
  application.createDatabase)

router.delete("/",
  auth.required, 
  body('serverId').isString(),
  body('name').isString(),
  application.deleteDatabase)

router.post("/users", 
  auth.required, 
  body('serverId').isString(),
  application.getDatabaseUsers)
  
router.post("/users/create", 
  auth.required, 
  body('serverId').isString(),
  body('name').isString(),
  body('password').isString(),
  body('confirm_password').isString(),
  application.createDatabaseUser)

router.delete("/users", 
  auth.required, 
  body('serverId').isString(),
  body('name').isString(),
  application.deleteDatabaseUser)

module.exports = router
