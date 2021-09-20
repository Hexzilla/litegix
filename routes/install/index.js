const router = require("express").Router();
const auth = require("../auth");
const server = require("../../services/server-service");

router.get("/script/file/:token", async function (req, res) {
  try {
    const token = req.params.token;
    const text = await server.getScriptFile(token);
    res.send(text);
  } catch (e) {
    console.error(e);
    return res.status(501).json({ success: false });
  }
});

module.exports = router;
