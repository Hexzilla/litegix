const valiator = require("express-validator");
const { getServer } = require("./server-service");
const mongoose = require("mongoose");
const CronJob = mongoose.model("CronJob");
const activity = require("./activity");

const rebuildJob = async function (req, res) {
  try {
    const cronjob = await CronJob.findById(req.params.jobId);
    return res.json({
      success: true,
      data: { cronjob },
    });
  } catch (e) {
    console.error(e);
    return res.status(501).json({ success: false });
  }
};

const removeCronJob = async function (req, res) {
  try {
    const cronJob = await CronJob.findById(req.params.jobId);
    if (!cronJob) {
      return res.status(422).json({
        success: false,
        errors: {
          message: "It doesn't exists",
        },
      });
    }

    errors = await agent.removeCronJob(req.body);
    if (errors) {
      return res.status(422).json({
        success: false,
        errors: errors,
      });
    }

    await cronJob.remove();

    res.json({
      success: true,
      message: "It has been successfully deleted.",
    });
  } catch (error) {
    return res.status(501).json({
      success: false,
      errors: error,
    });
  }
};

module.exports = {
  getCronJobs: async function (server) {
    const cronJobs = await CronJob.find({ serverId: server.id });
    return {
      success: true,
      data: { cronJobs },
    };
  },

  getCronJob: async function (jobId) {
    const cronjob = await CronJob.findById(jobId);
    return {
      success: true,
      data: { cronjob },
    };
  },

  createCronJob: async function (server) {
    return {
      success: true,
      vendor_binaries: [
        "/Litegix/Packages/php72/bin/php",
        "/Litegix/Packages/php73/bin/php",
        "/Litegix/Packages/php74/bin/php",
        "/Litegix/Packages/php80/bin/php",
        "/user/bin/node",
        "/bin/bash",
      ],
      predefined_settings: [
        "Every Minutes",
        "Every 10 Minutes",
        "Every 30 Minutes",
        "Every Hours",
        "All midnight",
        "Every Day",
        "Every Week",
        "Every Month",
      ],
    };
  },

  storeCronJob: async function (server, data) {
    const exists = await CronJob.findOne({
      serverId: server.id,
      label: data.label,
    });
    if (exists) {
      return {
        success: false,
        errors: { label: "has already been taken." },
      };
    }

    // errors = await agent.createCronJob(data)
    // if (errors) {
    //   return {
    //     success: false,
    //     errors: errors
    //   }
    // }

    data.time = [
      data.minute,
      data.hour,
      data.dayOfMonth,
      data.month,
      data.dayOfWeek,
    ].join(" ");

    const cronJob = new CronJob(data);
    cronJob.serverId = server.id;
    await cronJob.save();

    const message = `Added new Cron Job ${data.label}`;
    await activity.createServerActivityLogInfo(server.id, message);

    return {
      success: true,
      data: { cronJob },
    };
  },
  removeCronJob,
};
