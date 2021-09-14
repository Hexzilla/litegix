const { body } = require("express-validator");
const router = require("express").Router();
const auth = require("../auth");
const validate = require("../validate");
const server = require("../../services/server-service");

router.delete("/", auth.required, async function (req, res) {
  try {
    const response = await server.deleteServer(req.server);
    return res.json(response);
  } catch (e) {
    console.error(e);
    return res.status(501).json({ success: false });
  }
});

router.post("/activitylogs", auth.required, server.activityLogs);

router.post("/summary", auth.required, server.getSummary);

router.get("/phpVersion", auth.required, async function (req, res) {
  try {
    const response = await server.getPhpVersion(req.server);
    return res.json(response);
  } catch (e) {
    console.error(e);
    return res.status(501).json({ success: false });
  }
});

router.put(
  "/phpVersion",
  auth.required,
  body("version").notEmpty(),
  validate,
  async function (req, res) {
    try {
      const version = req.body.version;
      const response = await server.updatePhpVersion(req.server, version);
      return res.json(response);
    } catch (e) {
      console.error(e);
      return res.status(501).json({ success: false });
    }
  }
);

module.exports = router;
