var router = require('express').Router()
const subscription = require('../../services/subscription')
var auth = require('../auth')

//
// router.use("/credittopup", require("./credittopup"))
// router.use("/account", require("./account"))
// router.use("/apikey", require("./apikey"))
// router.use("/notifications", require("./credittopup"))
router.post('/', auth.required, subscription.getCurrentServerPlan)

router.post('/create', auth.required, subscription.createSubscription)

router.get('/credittopup', subscription.getCredittopup)
router.get('/serverplans', subscription.getServerPlans)
router.get('/backupplans', subscription.getBackupPlans)
router.post('/insertbalance', auth.required, subscription.insertUserBalance)
router.post('/active', auth.required, subscription.active)
router.post('/inactive', auth.required, subscription.inactive)
router.post('/canceled', auth.required, subscription.canceled)

export default router
