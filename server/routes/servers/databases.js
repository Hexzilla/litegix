const { body } = require('express-validator')
const router = require("express").Router()
const auth = require("../auth")
const database = require("../../services/database-service")

router.post("/", 
  auth.required, 
  body('serverId').isString(),
  database.getDatabases)

router.post("/create", 
  auth.required, 
  body('serverId').isString(),
  body('name').isString(),
  body('encoding').isString(),
  database.createDatabase)

router.delete("/",
  auth.required, 
  body('serverId').isString(),
  body('name').isString(),
  database.deleteDatabase)

router.post("/users", 
  auth.required, 
  body('serverId').isString(),
  database.getDatabaseUsers)
  
router.post("/users/create", 
  auth.required, 
  body('serverId').isString(),
  body('name').isString(),
  body('password').isString(),
  body('confirm_password').isString(),
  database.createDatabaseUser)

router.delete("/users", 
  auth.required, 
  body('serverId').isString(),
  body('name').isString(),
  database.deleteDatabaseUser)

module.exports = router
