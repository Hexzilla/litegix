const { body } = require("express-validator");
const router = require("express").Router();
const auth = require("../auth");
const validate = require("../validate");
const server = require("../../services/server-service");
const install = require("../../services/install-service");

router.get("/bashscript", auth.required, async function (req, res) {
  try {
    const userId = req.payload.id;
    const response = await install.getBashScript(userId, req.server);
    res.json(response);
  } catch (e) {
    console.error(e);
    return res.status(501).json({ success: false });
  }
});

router.get("/installstatus", auth.required, async function (req, res) {
  try {
    const response = await install.getInstallStatus(req.server);
    res.json(response);
  } catch (e) {
    console.error(e);
    return res.status(501).json({ success: false });
  }
});

module.exports = router;
