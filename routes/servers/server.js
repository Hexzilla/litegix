const { body } = require('express-validator')
const router = require("express").Router()
const auth = require("../auth")
const server = require("../../services/server")

router.delete("/",
  auth.required,
  server.deleteServer);
  
  router.post("/activitylogs",
    auth.required,
    server.activityLogs);

    router.post("/delete",
    auth.required,
    server.deleteServer);

router.post("/summary",
  auth.required,
  server.getSummary);

router.get("/phpVersion",
  auth.required,
  server.getPHPVersion);

router.post("/phpVersion",
  auth.required,
  body('phpVersion').notEmpty(),
  server.updatePHPVersion);

module.exports = router
