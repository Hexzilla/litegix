const valiator = require("express-validator");
const { getServer } = require("./server-service");
const mongoose = require("mongoose");
const CronJob = mongoose.model("CronJob");
const activity = require("./activity");

const createCronJob = async function (req, res) {
  try {
    let errors = valiator.validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, errors: errors.array() });
    }

    let server = req.server;
    let cronjob = await CronJob.findOne({
      serverId: server.id,
      label: req.body.label,
    });
    if (cronjob) {
      return res.status(422).json({
        success: false,
        errors: { label: "has already been taken." },
      });
    }

    // errors = await agent.createCronJob(req.body)
    // if (errors) {
    //   return res.status(422).json({
    //     success: false,
    //     errors: errors
    //   })
    // }

    req.body.time =
      req.body.minute +
      " " +
      req.body.hour +
      " " +
      req.body.dayOfMonth +
      " " +
      req.body.month +
      " " +
      req.body.dayOfWeek;

    cronjob = new CronJob(req.body);
    cronjob.serverId = server.id;
    await cronjob.save();

    const message = `Added new Cron Job ${req.body.label}`;
    await activity.createServerActivityLogInfo(server.id, message);

    res.json({
      success: true,
      message: "It has been successfully created.",
    });
  } catch (e) {
    console.error(e);
    return res.status(501).json({ success: false });
  }
};

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
    const cronjobs = await CronJob.find({ serverId: server.id });
    return {
      success: true,
      data: { cronjobs },
    };
  },

  getCronJob: async function (jobId) {
    const cronjob = await CronJob.findById(jobId);
    return {
      success: true,
      data: { cronjob },
    };
  },

  createCronJob,
  removeCronJob,
};
