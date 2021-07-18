const validator = require('express-validator')
const mongoose = require("mongoose")
const User = mongoose.model("User")
const Company = mongoose.model("Company")

const getProfile = function (req, res, next) {
  User.findById(req.payload.id)
    .populate('company')
    .then(user => {
      if (!user) { return res.sendStatus(404); }

      res.json(user.toProfileJSON())
    })
    .catch(next);
}

const updateProfile = function(req, res, next) {
  const errors = validator.validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  User.findById(req.payload.id)
    .then(user => {
      if (!user) { return res.sendStatus(404); }
      
      user.email = req.body.email
      user.username = req.body.name
      user.timezone = req.body.timezone
      user.loginNotification = req.body.loginNotification
      user.save()
      res.json({ success: true, message: 'Profile is updated' })
    })
    .catch(next)
}

const updateCompany = function(req, res, next) {
  const errors = validator.validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  User.findById(req.payload.id)
    .populate('company')
    .then(user => {
      if (!user) { return res.sendStatus(404); }
      
      if (!user.company) {
        const company = new Company(req.body)
        company.save()

        user.company = company
        user.save()
      }
      else {
        user.company.name = req.body.name
        user.company.address1 = req.body.address1
        user.company.address2 = req.body.address2
        user.company.city = req.body.city
        user.company.postal = req.body.postal
        user.company.state = req.body.state
        user.company.country = req.body.country
        user.company.tax = req.body.tax
        user.company.save()
      }

      res.json({ success: true, message: 'Profile is updated' })
    })
    .catch(next)
}

module.exports = {
  getProfile,
  updateProfile,
  updateCompany
}