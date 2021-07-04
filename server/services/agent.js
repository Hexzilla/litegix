const axios = require('axios');

const diskClean = async function () {
  try {
    const response = await axios.get(`http://${address}/disk/clean`);
    return null
  }
  catch (e) {
    console.log(e)
    return e;
  }
}

const createDatabase = async function (address, data) {
  try {
    const response = await axios.post(`http://${address}/database/create`, data);
    return null
  }
  catch (e) {
    console.log(e)
    return e;
  }
}

const deleteDatabase = async function (name) {
  try {
    const response = await axios.post(`http://${address}/database/delete`, {name: name});
    return null
  }
  catch (e) {
    console.log(e)
    return e;
  }
}

const createDatabaseUser = async function(data) {
  try {
    const response = await axios.post(`http://${address}/database/user/create`, data);
    return null
  }
  catch (e) {
    console.log(e)
    return e;
  }
}

const deleteDatabaseUser = async function (name) {
  try {
    const response = await axios.post(`http://${address}/database/user/delete`, {name: name});
    return null
  }
  catch (e) {
    console.log(e)
    return e;
  }
}

const createWebApplication = async function() {
  return null
}

const deleteWebApplication = async function (name) {
  return null
}

const createSystemUser = async function(data) {
  try {
    const response = await axios.post(`http://${address}/system/user/create`, data);
    return null
  }
  catch (e) {
    console.log(e)
    return e;
  }
}

const deleteSystemUser = async function (name) {
  try {
    const response = await axios.post(`http://${address}/system/user/delete`, {name: name});
    return null
  }
  catch (e) {
    console.log(e)
    return e;
  }
}

const createDeploymentKey = async function(data) {
  try {
    const response = await axios.post(`http://${address}/deploymentkey/create`, data);
    return null
  }
  catch (e) {
    console.log(e)
    return e;
  }
}

const deleteDeploymentKey = async function (name) {
  try {
    const response = await axios.post(`http://${address}/deploymentkey/delete`, {name: name});
    return null
  }
  catch (e) {
    console.log(e)
    return e;
  }
}

module.exports = {
  createDatabase,
  deleteDatabase,
  createDatabaseUser,
  deleteDatabaseUser,
  createWebApplication,
  deleteWebApplication,
  createSystemUser,
  deleteSystemUser,
  createDeploymentKey,
  deleteDeploymentKey,
}