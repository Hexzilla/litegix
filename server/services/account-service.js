const mongoose = require("mongoose")
const User = mongoose.model("User")
const Company = mongoose.model("Company")


const changePassword = function (req, res, next) {

}

const deleteAccount = function (req, res, next) {
  
}

module.exports = {
  changePassword,
  deleteAccount
}