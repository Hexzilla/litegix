const router = require("express").Router();
const auth = require("../auth");
const activity = require("../../services/activity-service");

router.get("/", auth.required, async function (req, res) {
  try {
    const userId = req.payload.id;
    const response = await activity.getAccountActivityLogs(userId);
    return res.json(response);
  } catch (e) {
    console.error(e);
    return res.status(501).json({ success: false });
  }
});

module.exports = router;
