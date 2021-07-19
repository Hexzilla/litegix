const { body } = require('express-validator')
const router = require("express").Router()
const auth = require("../auth")
const apiKey = require("../../services/apikey")

router.get("/", 
  auth.required,
  apiKey.getApiKeys)

router.get("/regenerate",
  auth.required,
  apiKey.createApiKeys)

router.post("/enableaccess",
  auth.required,
  body('state').isBoolean(),
  apiKey.enableAccess)

module.exports = router
