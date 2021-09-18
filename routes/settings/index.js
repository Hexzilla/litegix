var router = require("express").Router();

router.use("/profile", require("./profile"));
router.use("/account", require("./account"));
router.use("/apiKeys", require("./api-keys"));
router.use("/notifications", require("./notifications"));
router.use("/ipwhitelist", require("./ipwhitelist"));
router.use("/activity", require("./activity"));

module.exports = router;
