const router = require("express").Router();
const auth = require("../auth");
const server = require("../../services/server-service");
const install = require("../../services/install-service");

router.get("/agent/script/:token", async function (req, res) {
  try {
    const token = req.params.token;
    const text = await install.getAgentInstallScript(token);
    res.send(text);
  } catch (e) {
    console.error(e);
    return res.status(501).json({ success: false });
  }
});

module.exports = router;
