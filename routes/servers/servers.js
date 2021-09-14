const { body } = require("express-validator");
const router = require("express").Router();
const auth = require("../auth");
const validate = require("../validate");
const server = require("../../services/server-service");

router.get("/", auth.required, async function (req, res) {
  try {
    const response = await server.getServers(req.payload.id);
    return res.json(response);
  } catch (e) {
    console.error(e);
    return res.status(501).json({ success: false });
  }
});

router.post(
  "/",
  auth.required,
  body("name").notEmpty(),
  body("address").isIP(4),
  body("web_server").notEmpty(),
  body("database").notEmpty(),
  body("phpVersion").notEmpty(),
  validate,
  async function (req, res) {
    try {
      const response = await server.storeServer(req.payload.id, req.body);
      return res.json(response);
    } catch (e) {
      console.error(e);
      return res.status(501).json({ success: false });
    }
  }
);

module.exports = router;
