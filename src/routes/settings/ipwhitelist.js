import { body } from 'express-validator'
import { Router, Request, Response, NextFunction } from 'express'
const auth = require('../auth')
const whitelist = require('../../services/ipwhitelist')

router.get('/', auth.required, whitelist.getWhiteList)

router.delete('/:ipAddress', auth.required, whitelist.deleteIp)

router.post('/:isEnable', auth.required, whitelist.setEnableOrDisable)

export default router
