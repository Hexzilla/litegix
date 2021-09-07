const { body } = require("express-validator");
const router = require("express").Router();
const auth = require("../auth");
const validate = require("../validate");
const system = require("../../services/system-service");

router.get("/", auth.required, async function (req, res) {
  try {
    const response = await system.getSystemUsers(req.server);
    return res.json(response);
  } catch (e) {
    console.error(e);
    return res.status(501).json({ success: false });
  }
});

router.get("/:userId", auth.required, async function (req, res) {
  try {
    const userId = req.params.userId;
    const response = await system.getSystemUserById(req.server, userId);
    return res.json(response);
  } catch (e) {
    console.error(e);
    return res.status(501).json({ success: false });
  }
});

router.post(
  "/",
  auth.required,
  body("name").isString(),
  body("password").isString(),
  validate,
  async function (req, res) {
    try {
      const response = await system.storeSystemUser(req.server, req.body);
      return res.json(response);
    } catch (e) {
      console.error(e);
      return res.status(501).json({ success: false });
    }
  }
);

router.post(
  "/changepassword",
  auth.required,
  body("id").isString(),
  body("password").isLength({ min: 8 }).trim().escape(),
  system.changeSystemUserPassword
);

router.delete("/:userId", auth.required, async function (req, res) {
  try {
    const userId = req.params.userId;
    const response = await system.deleteSystemUser(req.server, userId);
    return res.json(response);
  } catch (e) {
    console.error(e);
    return res.status(501).json({ success: false });
  }
});

module.exports = router;
