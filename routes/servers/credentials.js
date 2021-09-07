const { body } = require("express-validator");
const router = require("express").Router();
const auth = require("../auth");
const validate = require("../validate");
const system = require("../../services/system-service");

router.get("/", auth.required, async function (req, res) {
  try {
    const response = await system.getServerSSHKeys(req.server);
    return res.json(response);
  } catch (error) {
    console.error(e);
    return res.status(501).json({ success: false });
  }
});

router.get("/vault", auth.required, system.getVaultedSSHKeys);

router.get("/create", auth.required, system.createServerSSHKey);

router.post(
  "/",
  auth.required,
  body("label").isString(),
  body("userId").isString(),
  body("publicKey").isString(),
  validate,
  async function (req, res) {
    try {
      const response = await system.storeServerSSHKey(req.server, req.body);
      return res.json(response);
    } catch (error) {
      console.error(e);
      return res.status(501).json({ success: false });
    }
  }
);

router.delete("/:keyId", auth.required, async function (req, res) {
  try {
    const keyId = req.params.keyId;
    const response = await system.deleteServerSSHKey(req.server, keyId);
    return res.json(response);
  } catch (error) {
    console.error(e);
    return res.status(501).json({ success: false });
  }
});

module.exports = router;
