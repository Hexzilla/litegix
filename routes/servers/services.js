const { body } = require('express-validator')
const router = require("express").Router()
const auth = require("../auth")
const service = require("../../services/service")

router.get("/",
  auth.required,
  service.getSystemServices)

module.exports = router
