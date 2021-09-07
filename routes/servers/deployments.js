const { body } = require("express-validator");
const router = require("express").Router();
const auth = require("../auth");
const validate = require("../validate");
const system = require("../../services/system-service");

router.get("/", auth.required, async function (req, res) {
  try {
    const response = await system.getDeploymentKeys(req.server);
    return res.json(response);
  } catch (e) {
    console.error(e);
    return res.status(501).json({ success: false });
  }
});

router.post(
  "/",
  auth.required,
  body("userId").isString(),
  validate,
  async function (req, res) {
    try {
      const userId = req.body.userId;
      const response = await system.storeDeploymentKey(req.server, userId);
      return res.json(response);
    } catch (e) {
      console.error(e);
      return res.status(501).json({ success: false });
    }
  }
);

router.delete(
  "/",
  auth.required,
  body("serverId").isString(),
  body("name").isString(),
  system.deleteDeploymentKey
);

module.exports = router;
