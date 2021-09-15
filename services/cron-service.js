const valiator = require("express-validator");
const { getServer } = require("./server-service");
const mongoose = require("mongoose");
const CronJob = mongoose.model("CronJob");
const Supervisor = mongoose.model("Supervisor");
const activity = require("./activity-service");

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

const getVendorBinaries = function () {
  return [
    "/Litegix/Packages/php72/bin/php",
    "/Litegix/Packages/php73/bin/php",
    "/Litegix/Packages/php74/bin/php",
    "/Litegix/Packages/php80/bin/php",
    "/user/bin/node",
    "/bin/bash",
  ];
};

const getPredefinedSettings = function () {
  return [
    "Every Minutes",
    "Every 10 Minutes",
    "Every 30 Minutes",
    "Every Hours",
    "All midnight",
    "Every Day",
    "Every Week",
    "Every Month",
  ];
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
      vendor_binaries: getVendorBinaries(),
      predefined_settings: getPredefinedSettings(),
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

    /*const errors = await agent.createCronJob(data)
    if (errors) {
      return {
        success: false,
        errors: errors
      }
    }*/

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
  removeCronJob: async function (jobId) {
    const cronJob = await CronJob.findById(jobId);
    if (!cronJob) {
      return {
        success: false,
        errors: {
          message: "It doesn't exists",
        },
      };
    }

    /*const errors = await agent.removeCronJob(req.body);
    if (errors) {
      return {
        success: false,
        errors: errors,
      };
    }*/

    await cronJob.remove();

    return {
      success: true,
      data: { cronJob },
    };
  },

  getSupervisorJobs: async function (server) {
    const supervisors = await Supervisor.find({ serverId: server.id });
    return {
      success: true,
      data: { supervisors },
    };
  },

  createSupervisorJob: async function (server) {
    return {
      success: true,
      vendor_binaries: getVendorBinaries(),
      predefined_settings: getPredefinedSettings(),
    };
  },

  storeSupervisorJob: async function (server, data) {
    const exists = await Supervisor.findOne({
      serverId: server.id,
      name: data.name,
    });
    if (exists) {
      return {
        success: false,
        errors: { name: "has already been taken." },
      };
    }

    /*errors = await agent.createSupervisorJob(data);
    if (errors) {
      return {
        success: false,
        errors: errors,
      };
    }*/

    const supervisor = new Supervisor(data);
    supervisor.serverId = server.id;
    await supervisor.save();

    const message = `Added new Supervisor Job ${data.name}`;
    await activity.createServerActivityLogInfo(server.id, message);

    return {
      success: true,
      data: { supervisor },
    };
  },

  deleteSupervisorJob: async function (jobId) {
    const supervisor = await Supervisor.findById(jobId);
    if (!supervisor) {
      return {
        success: false,
        errors: {
          message: "It doesn't exists",
        },
      };
    }

    /*const errors = await agent.removeSupervisorJob(req.body);
    if (errors) {
      return {
        success: false,
        errors: errors,
      };
    }*/

    await supervisor.remove();

    return {
      success: true,
      data: { supervisor },
    };
  },
};
