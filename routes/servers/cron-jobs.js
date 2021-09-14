const { body } = require("express-validator");
const router = require("express").Router();
const auth = require("../auth");
const cronjob = require("../../services/cron-service");

router.get("/", auth.required, async function (req, res) {
  try {
    const response = await cronjob.getCronJobs(req.server);
    return res.json(response);
  } catch (e) {
    console.error(e);
    return res.status(501).json({ success: false });
  }
});

router.get("/:jobId", auth.required, async function (req, res) {
  try {
    const jobId = req.params.jobId;
    const response = await cronjob.getCronJob(jobId);
    return res.json(response);
  } catch (e) {
    console.error(e);
    return res.status(501).json({ success: false });
  }
});

router.delete("/:jobId", auth.required, cronjob.removeCronJob);

router.post(
  "/",
  auth.required,
  body("label").isString(),
  body("username").isString(),
  body("command").isString(),
  body("minute").isString(),
  body("hour").isString(),
  body("dayOfMonth").isString(),
  body("month").isString(),
  body("dayOfWeek").isString(),
  cronjob.createCronJob
);

module.exports = router;
