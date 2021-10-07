const valiator = require('express-validator')
const mongoose = require('mongoose')
const IPAddress = mongoose.model('IPAddress')
const User = mongoose.model('User')

const getWhiteList = async function (req: Request, res: Response) {
  try {
    const whitelist = await IPAddress.find({ userId: req.payload.id })

    return res.json({
      success: true,
      data: { whitelist },
    })
  } catch (e) {
    console.error(e)
    return res.status(501).json({ success: false })
  }
}

const deleteIp = async function (req: Request, res: Response) {
  try {
    const whitelist = await IPAddress.findOneAndDelete(req.params.ipAddress)

    return res.json({
      success: true,
      data: { whitelist },
    })
  } catch (e) {
    console.error(e)
    return res.status(501).json({ success: false })
  }
}

const setEnableOrDisable = async function (req: Request, res: Response) {
  try {
    let isEnable = req.params.isEnable != 0 ? 'true' : 'false'
    await User.findByIdAndUpdate(
      req.payload.id,
      { $set: { ip_enable: isEnable } },
      { upsert: true },
      function (err, result) {
        if (err) {
          console.log(err)
        }
        console.log('RESULT: ' + result)
        res.send('successfully saved')
      }
    )
  } catch (e) {
    console.error(e)
    return res.status(501).json({ success: false })
  }
}

export default {
  getWhiteList,
  deleteIp,
  setEnableOrDisable,
}
