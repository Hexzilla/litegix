const { body } = require("express-validator");
const router = require("express").Router();
const auth = require("../auth");
const validate = require("../validate");
const server = require("../../services/server-service");

router.get("/shell", auth.required, async function (req, res) {
  try {
    const userId = req.payload.id;
    const response = await server.getInstallShell(userId, req.server);
    res.json(response);
  } catch (e) {
    console.error(e);
    return res.status(501).json({ success: false });
  }
});

router.get("/installstate/:state", server.getInstallState);

module.exports = router;
