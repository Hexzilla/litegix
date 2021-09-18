const { body } = require("express-validator");
const router = require("express").Router();
const auth = require("../auth");
const validate = require("../validate");
const account = require("../../services/account-service");

router.get("/", auth.required, async function (req, res) {
  try {
    const userId = req.payload.id;
    const response = await account.getApiKeys(userId);
    return res.json(response);
  } catch (e) {
    console.error(e);
    return res.status(501).json({ success: false });
  }
});

router.put("/apiKey", auth.required, async function (req, res) {
  try {
    const userId = req.payload.id;
    const response = await account.createApiKey(userId);
    return res.json(response);
  } catch (e) {
    console.error(e);
    return res.status(501).json({ success: false });
  }
});

router.put("/secretKey", auth.required, async function (req, res) {
  try {
    const userId = req.payload.id;
    const response = await account.createSecretKey(userId);
    return res.json(response);
  } catch (e) {
    console.error(e);
    return res.status(501).json({ success: false });
  }
});

router.post(
  "/enableaccess",
  auth.required,
  body("state").isBoolean(),
  validate,
  async function (req, res) {
    try {
      const userId = req.payload.id;
      const response = await account.enableAccess(userId, req.body);
      return res.json(response);
    } catch (e) {
      console.error(e);
      return res.status(501).json({ success: false });
    }
  }
);

module.exports = router;
