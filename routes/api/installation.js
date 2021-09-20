var router = require("express").Router();
const server = require("../../services/server-service");
const install = require("../../services/install-service");

router.get("/script/:token", async function (req, res) {
  try {
    const token = req.params.token;
    const text = await install.getAgentInstallScript(token);
    res.send(text);
  } catch (e) {
    console.error(e);
    return res.status(501).json({ success: false });
  }
});

router.post("/status/:token", async function (req, res) {
  try {
    const token = req.params.token;
    const result = await install.updateInstallState(token, req.body);
    res.json(result);
  } catch (e) {
    console.error(e);
    return res.status(501).json({ success: false });
  }
});

module.exports = router;
