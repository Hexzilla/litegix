const { body } = require("express-validator");
const router = require("express").Router();
const auth = require("../auth");
const validate = require("../validate");
const cronjob = require("../../services/cron-service");

router.get("/", auth.required, async function (req, res) {
  try {
    const response = await cronjob.getSupervisorJobs(req.server);
    return res.json(response);
  } catch (e) {
    console.error(e);
    return res.status(501).json({ success: false });
  }
});

router.get("/create", auth.required, async function (req, res) {
  try {
    const response = await cronjob.createSupervisorJob(req.server);
    return res.json(response);
  } catch (e) {
    console.error(e);
    return res.status(501).json({ success: false });
  }
});

router.post(
  "/",
  auth.required,
  body("name").isString(),
  body("userName").isString(),
  body("numprocs").isNumeric(),
  body("vendorBinary").isString(),
  body("command").isString(),
  body("autoStart").isBoolean(),
  body("autoRestart").isBoolean(),
  validate,
  async function (req, res) {
    try {
      const response = await cronjob.storeSupervisorJob(req.server, req.body);
      return res.json(response);
    } catch (e) {
      console.error(e);
      return res.status(501).json({ success: false });
    }
  }
);

router.delete("/:jobId", auth.required, async function (req, res) {
  try {
    const jobId = req.params.jobId;
    const response = await cronjob.deleteSupervisorJob(jobId);
    return res.json(response);
  } catch (e) {
    console.error(e);
    return res.status(501).json({ success: false });
  }
});

module.exports = router;
