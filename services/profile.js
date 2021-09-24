const validator = require("express-validator");
const mongoose = require("mongoose");
const User = mongoose.model("User");
const Company = mongoose.model("Company");

module.exports = {
  getProfile: async function (userId) {
    const user = await User.findById(userId).populate("company");
    if (!user) {
      return {
        success: false,
        errors: { message: "Invalid user" },
      };
    }

    return {
      success: true,
      data: user.toProfileJSON(),
    };
  },
  updateProfile: async function (userId, data) {
    const user = await User.findById(userId);
    if (!user) {
      return {
        success: false,
        errors: { message: "Invalid user" },
      };
    }

    if (user.email != data.email) {
      return {
        success: false,
        errors: {
          message: "Email can not be changed.",
        },
      };
    }

    user.username = data.name;
    user.timezone = data.timezone;
    user.loginNotification = data.loginNotification;
    await user.save();
    return {
      success: true,
      data: {
        profile: user.toJSON(),
      },
    };
  },
  updateCompany: async function (userId, data) {
    const user = await User.findById(userId).populate("company");
    if (!user) {
      return {
        success: false,
        errors: { message: "Invalid user" },
      };
    }

    if (!user.company) {
      const company = new Company(data);
      await company.save();
      user.company = company;
      await user.save();
    } else {
      user.company.name = data.name;
      user.company.address1 = data.address1;
      user.company.address2 = data.address2;
      user.company.city = data.city;
      user.company.postal = data.postal;
      user.company.state = data.state;
      user.company.country = data.country;
      user.company.tax = data.tax;
      await user.company.save();
    }
    return {
      success: true,
      data: {
        company: user.company.toJSON(),
      },
    };
  },
};
