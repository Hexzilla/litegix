const valiator = require("express-validator")
const mongoose = require("mongoose")
const User = mongoose.model("User")
const IPAddress = mongoose.model("IPAddress")
const passport = require("passport")
const randomstring = require("randomstring");
const nodemailer = require('nodemailer');
const DateDiff = require('date-diff');
const { required } = require("../routes/auth")

const getUser = async function (req) {
  try {
    const reject = (errors) => {
      return { errors: errors }
    }

    const errors = valiator.validationResult(req);
    if (!errors.isEmpty()) {
      return reject(errors.array())
    }

    const user = await User.findById(req.payload.id)
    if (!user) {
      return reject({ message: "User isn't exists" })
    }
    return { user: user }
  }
  catch (errors) {
    return { errors: errors }
  }
}

const login = function (req, res, next) {
  passport.authenticate(
    "login",
    { session: false },
    function (err, user, info) {
      if (err) {
        return next(err)
      }

      if (!user) {
        return res.status(422).json(info)
      }

      (async () => {
        var isCheck = await checkIpAdress(req, user);
      
        if(!isCheck){
          return res.status(422).json(info);
        }
        console.log("ischeck = " + isCheck);
        user.token = user.generateJWT()
        return res.json(user.toAuthJSON())
      })();
    }
  )(req, res, next)
}

const signup = function (req, res, next) {
  console.log('this is sign up');
  passport.authenticate(  //passport.js : passport.use("signup",
    "signup",
    { session: false },
    function (err, user) 
    {
        if (err) {
          return next(err)
        }
        if(!user) return res.json({ success: false })
        return res.json({ success: true })
    }
  )(req, res, next)
}

const changePassword = async function (req, res) {
  try {
    let {user, errors} = await getUser(req)
    if (errors) {
      return res.status(422).json({ success: false, errors: errors })
    }

    if (!user.validPassword(req.body.current_password)) {
      return res.status(422).json({ success: false, errors: { "current_password": "is invalid" }})
    }

    user.setPassword(req.body.password)
    await user.save()

    return res.json({
      success: true,
      message: "Your password has been successfully changed"
    })
  }
  catch (error) {
    return res.status(501).json({
      success: false,
      errors: error
    });
  }
}

const deleteAccount = async function (req, res) {
  
}

const generateApiKey = function() {
  return randomstring.generate(44)
}

const generateApiSecret = function() {
  return randomstring.generate(64)
}

const checkIpAdress = async function(req, user, res){
  let ipEqual = false;
  const whitelist = await IPAddress.find({ userId: user._id })
  whitelist.forEach(val => {
    if(req.connection.remoteAddress.toString() === val.address.toString()){    // main code
    // if("192.168.10.5" === val.address.toString()){                          // exam code
      ipEqual = true;
    }
  });
  if(!ipEqual){
    let result = await User.findOne({ _id: user._id })
    if (result.ip_enable) {
      verifyCode = randomstring.generate(16);//makeverify(15);
      var curDate = new Date();
      verify = {
        code : verifyCode,
        validat_time : add_minutes(curDate, 10),
        url : "http://localhost:3000/user_verify?userId="+user._id+"&verifycode="+verifyCode
      }
      verifyCodeUpdate(user._id, verify);
      sendMail(req); return false
    }
    else{
      try{
        addIpAddress(req,user.id)
      }
      catch(error){
        console.log("Ip Address is duplicated.")
      }
      return true
    }
  }
  return true;
}
const addIpAddress = function(req,userId){
  try{
    existIp = IPAddress.find({Address : req.connection.remoteAddress})
    if(!existIp)
    {
      const browser = req.useragent.browser || 'unknown'
      const addr = new IPAddress({
        address: req.connection.remoteAddress, //'192.168.10.2',
        browser: browser,
        userId: userId
      })
      addr.save()
    }
  }
  catch(e)
  {
    console.log(e)
  }
}

var verifyCodeUpdate = async function(userId, verify){
  await User.findByIdAndUpdate(userId, { $set: { verify: verify }},{upsert:true}, function(err, result){
    if(err){
        console.log(err);
    }
    else{
      return result;
    }
  });
}

var add_minutes =  function (dt, minutes) {
  return new Date(dt.getTime() + minutes*60000);
}
const sendMail = function(req){
  // send email 
  // let transport = nodemailer.createTransport({
  //   host: 'smtp.mailtrap.io',
  //   port: 2525,
  //   auth: {
  //      user: 'put_your_username_here',
  //      pass: 'put_your_password_here'
  //   }
  // });
  // const message = {
  //   from: 'elonmusk@tesla.com', // Sender address
  //   to: 'to@email.com',         // List of recipients
  //   subject: 'Design Your Model S | Tesla', // Subject line
  //   text: 'Have the most fun you can in a car. Get your Tesla today!' // Plain text body
  // };
  // transport.sendMail(message, function(err, info) {
  //   if (err) {
  //     console.log(err)
  //   } else {
  //     console.log(info);
  //   }
  // });
}

// const moment = required("moment")
const userVerify = async function(req, res, next){
  // userId/:verifyCode
  const user = new User();
  let result = await User.findById({ _id: req.params.userId })
  if (!result) {
    return res.status(422).json({
    success: false,
    errors: { 
        message: 'Can not find user.'
      }
    })
  }
  var curDate = new Date();
  if(req.params.verifyCode === result.verify.code && curDate.valueOf() <= Date.parse(result.verify.validat_time).valueOf())
  {
    verify = null
    verifyCodeUpdate(req.params.userId, verify);
    addIpAddress(req, req.params.userId)
    user.token = user.generateJWT()
    return res.json(user.toAuthJSON())
  }
  else{
    res.json({
        success: false,
        message: "time out verify!"
    })
  }
}

module.exports = {
  getUser,
  login,
  signup,
  changePassword,
  deleteAccount,
  checkIpAdress,
  userVerify
}
