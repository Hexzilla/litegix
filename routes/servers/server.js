const { body } = require('express-validator')
const router = require("express").Router()
const auth = require("../auth")
const server = require("../../services/server")

router.post("/delete",
  auth.required,
  server.deleteServer);

router.post("/summary",
  auth.required,
  server.getSummary);

module.exports = router
