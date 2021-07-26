const { body } = require('express-validator')
const router = require("express").Router()
const auth = require("../auth")
const cronjob = require("../../services/cronjobs")

router.get("/", auth.required, cronjob.getCronJobs)
router.get("/:jobId", auth.required, cronjob.getCronJob)
router.delete("/:jobId", auth.required, cronjob.removeCronJob)

router.post("/", 
  auth.required, 
  body('label').isString(),
  body('username').isString(),
  body('command').isString(),
  body('minute').isString(),
  body('hour').isString(),
  body('dayOfMonth').isString(),
  body('month').isString(),
  body('dayOfWeek').isString(),
  cronjob.createCronJob)
    
module.exports = router
