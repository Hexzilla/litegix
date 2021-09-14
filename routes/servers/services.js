const { body } = require("express-validator");
const router = require("express").Router();
const auth = require("../auth");
const system = require("../../services/system-service");

router.get("/", auth.required, async function (req, res) {
  try {
    const response = await system.getSystemServices(req, res.server);
    return res.json(response);
  } catch (e) {
    console.error(e);
    return res.status(501).json({ success: false });
  }
});

module.exports = router;
