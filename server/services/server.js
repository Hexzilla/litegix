const path = require('path')
const fs = require('fs')
const util = require('util')
const readFile = util.promisify(fs.readFile);
const valiator = require('express-validator')
const mongoose = require("mongoose")
const Server = mongoose.model("Server")
const crypto = require('./crypto')

const defaultScript = "export DEBIAN_FRONTEND=noninteractive; echo 'Acquire::ForceIPv4 \"true\";' | tee /etc/apt/apt.conf.d/99force-ipv4; apt-get update; apt-get install curl netcat-openbsd -y; curl -4 --silent --location http://localhost:3000/servers/config/script/USER_INFO | bash -; export DEBIAN_FRONTEND=newt"

const getServer = async function (req) {
  try {
    const reject = (errors) => {
      return { errors: errors }
    }

    const errors = valiator.validationResult(req);
    if (!errors.isEmpty()) {
      return reject(errors.array())
    }

    const server = await Server.findById(req.body.serverId)
    if (!server) {
      return reject({
        message: "Server doesn't exists" 
      })
    }
    return { server }
  }
  catch (errors) {
    return { errors: errors }
  }
}

const getServers = function (req, res, next) {
  Server.find({user: req.payload.id})
    .then(servers => {
      console.log(servers)
      res.json({
        success: true, 
        data: {
          servers: servers
        }
      })
    })
    .catch(next)
}

const createServer = async function (req, res, next) {
  try {
    const errors = valiator.validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let result = await Server.findOne({ address: req.body.address })
    if (result) {
      return res.status(422).json({
        success: false,
        message: "IP address already exists.",
        errors: { 
          address: 'already exists'
        }
      })
    }

    result = await Server.findOne({ name: req.body.name, user: req.payload.id })
    if (result) {
      return res.status(422).json({
        success: false,
        message: "Server name already exists.",
        errors: { 
          name: 'already exists'
        }
      })
    }

    const server = new Server(req.body)
    server.connected = false
    server.user = req.payload.id
    await server.save()

    res.json({
      success: true,
      message: "Your server has been successfully created."
    })
  }
  catch (e) {
    console.error(e)
    return res.status(501).json({ success: false });
  }
}

const getShellCommands = function(req, res) {
  const errors = valiator.validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  
  const token = {
    userId: req.payload.id,
    address: req.body.address,
    serverId: '',
  }
  console.log('commands-token', token)
  const encrypted = crypto.encrypt(JSON.stringify(token))
  const scriptId = encrypted.split('/').join('.')
  const commands = defaultScript.replace('USER_INFO', scriptId)
  console.log('commands', commands)

  res.json({
    success: true,
    data: {
      commands: commands
    }
  })
}

const getToken = function(token) {
  const encrypted = token.split('.').join('/')
  const decrypted = crypto.decrypt(encrypted)
  return JSON.parse(decrypted)
}

const getScript = async function (req, res, next) {
  const token = getToken(req.params.token)
  console.log('GetScript, Token:', token)

  const filePath = path.join(__dirname, '../scripts/install.sh')
  readFile(filePath, 'utf8')
    .then(text => {
      console.log(text)
      res.send(text)
    })
    .catch(err => {
      return res.status(422).json({ errors: "Can't read file" })
    })
}

const updateState = async function (req, res, next) {
  const token = getToken(req.params.token)
  console.log('updateState, Token:', token, req.body)
  res.json({
    success: true
  })
}

const summary = async function (req, res, next) {
  const server = await Server.findById(req.body.server);
  if (!server) {
    return res.status(422).json({
      success: false,
      message: "Server doesn't exists",
      errors: { 
        server: "doesn't exists"
      }
    })
  }

  //TODO
  server.system = {
    kernelVersion: "5.4.0-72-generic",
    processorName: "Intel Xeon Processor (Skylake, IBRS)",
    totalCPUCore: 2,
    totalMemory: 3.750080108642578,
    freeMemory: 3.2643470764160156,
    diskTotal: 40.18845696,
    diskFree: 33.756172288,
    loadAvg: 0,
    uptime: "475h 50m 20s"
  }
  await server.save()

  res.json({
    success: true,
    data: server.toSummaryJSON()
  })
}

const deleteServer = async function (req, res, next) {
  res.json({ success: true })
}

module.exports = {
  getServer,
  getServers,
  createServer,
  getScript,
  getShellCommands,
  updateState,
  summary,
  deleteServer
}