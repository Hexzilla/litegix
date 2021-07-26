const valiator = require('express-validator')
const {getServer} = require("./server")
const mongoose = require("mongoose")
const Application = mongoose.model("Application")
const AdvancedSSL = mongoose.model("AdvancedSSL")
const BasicSSL = mongoose.model("BasicSSL")
const Domains = mongoose.model("Domains")
const GitRepository = mongoose.model("GitRepository")
const Installer = mongoose.model("InstallerPHPScript")
const SystemUser = mongoose.model("SystemUser")
const User = mongoose.model("User")
const agent = require("./agent")
const activity = require("./activity")
const timezones = require('timezones-list');

const getWebApplications = async function (req, res) {
  try {
    const applications = await Application.find({ serverId: req.server.id })
    return res.json({ 
      success: true,
      data: applications
    })
  }
  catch (e) {
    console.error(e)
    return res.status(501).json({ success: false });
  }
}

const getWebApplication = async function (req, res) {
  try {
    const application = await Application.findById(req.params.id)
    return res.json({ 
      success: true,
      data: application
    })
  }
  catch (e) {
    console.error(e)
    return res.status(501).json({ success: false });
  }
}

const getapplicationsettings = async function (req, res) {
  try {
    const application = await Application.findById(req.params.id)
    return res.json({ 
      success: true,
      data: application.settings
    })
  }
  catch (e) {
    console.error(e)
    return res.status(501).json({ success: false });
  }
}

const webApplication = async function (req, res) {
  let server = req.server
  // let systemUsers = SystemUser.find({serverId: server.Id})
  return res.json({
    success: true,
    data: {
      // users: systemUsers,
      stacks:[
        {text: "NGINX + Apache2 Hybrid", value:"hybrid"},
        {text: "Native NGINX", value:"nativenginx"},
        {text: "Native Nginx + Custom", value:"customnginx"}
      ],
      stackMode:[
        {text: "Production", value:"production"},
        {text: "Development", value: "development"},
      ],
      phpVersion:[
        {text:"PHP7.0",value:"PHP7.0"},
        {text:"PHP7.1",value:"PHP7.1"},
        {text:"PHP7.2",value:"PHP7.2"},
        {text:"PHP5.5",value:"PHP5.5"},
        {text:"PHP5.6",value:"PHP5.6"} 
      ],
      ssl_tlsMethod:[
        {text:"basic",value:"basic"},
        {text:"advanced",value:"advanced"},
      ],
      timezones:timezones,
      processManager:[
        {text:"Ondemand",value:"ondemand"},
        {text:"Dynamic",value:"dynamic"},
        {text:"Static",value:"static"},
      ],
      collections: [
        "utf8_general_ci",
        "utf16_general_ci"
      ]
    }
  })
}

//TODO
const createWebApplication = async function (req, res) {
  try {
    let errors = valiator.validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, errors: errors.array() })
    }

    let server = req.server
    let application = await Application.findOne({ serverId: server.id, name: req.body.name })
    if (application) {
      return res.status(422).json({
        success: false,
        errors: { name: "has already been taken." }
      })
    }

    errors = await agent.createWebApplication(req.body)
    if (errors) {
      return res.status(422).json({
        success: false,
        errors: errors
      })
    }
    const user = await User.findById(req.payload.id)
    if (!user) {
      return res.status(501).json({ 
        success: false,
        message: "Invalid User"
      });
    }
     
    let data = {
      "server_user_id": req.body.user,
      "name": req.body.name,
      "rootPath": "\/home\/"+user.username+"\/webapps\/"+req.body.name,
      "publicPath": req.body.publicPath == null ? "\/home\/"+user.username+"\/webapps\/"+req.body.name:req.body.publicPath,
      "phpVersion": req.body.phpVersion,
      "stack": req.body.stack,
      "stackMode": req.body.stackMode,
      "type": "custom",
      "defaultApp": false,
      "alias": null,
      "pullKey1": "jwMZwtXP3ItQRKKoMSZboAXr1561748870",
      "pullKey2": "zU4gYF96NZGjNqGSjUhasn0YZmlK2Ctu",
      "advancedSSL":{
        "advancedSSL":req.body.ssl_tlsMethod=="advanced",
        "autoSSL":req.body.autoSSL
      },
      "settings":{
        "disableFunctions": req.body.disableFunctions,
        "timezone": req.body.timezone,
        "maxExecutionTime": req.body.maxExecutionTime,
        "maxInputTime": req.body.maxExecutionTime,
        "maxInputVars": req.body.maxInputVars,
        "memoryLimit": req.body.memoryLimit,
        "postMaxSize": req.body.postMaxSize,
        "uploadMaxFilesize": req.body.uploadMaxFilesize,
        "allowUrlFopen": req.body.allowUrlFopen,
        "sessionGcMaxlifetime": req.body.sessionGcMaxlifetime,
        "processManager": req.body.processManager,
        "processManagerStartServers": req.body.processManagerStartServers,
        "processManagerMinSpareServers": req.body.processManagerMinSpareServers,
        "processManagerMaxSpareServers": req.body.processManagerMaxSpareServers,
        "processManagerMaxChildren": req.body.processManagerMaxChildren,
        "processManagerMaxRequests": req.body.processManagerMaxRequests,
        "openBasedir": req.body.openBasedir,
        "clickjackingProtection": req.body.clickjackingProtection,
        "xssProtection": req.body.xssProtection,
        "mimeSniffingProtection": req.body.mimeSniffingProtection
      }
    }

    let domain_data = {
      name: req.body.domain_name,
      type: "primary",
      www: "www_enable",
      dns_integration: req.body.dns_integration,
      rediraction: req.body.domain_rediraction
    }

    application = new Application(data)
    application.serverId = server.id
    await application.save()
    
    let domain = new Domains(domain_data)
    domain.applicationId = application.id 
    await domain.save()

    const message = `Added new web application ${req.body.name}`;
    await activity.createServerActivityLogInfo(server.id, message)

    res.json({
      success: true,
      message: "It has been successfully created.",
      data:application
    })
  }
  catch (e) {
    console.error(e)
    return res.status(501).json({ success: false });
  }
}

const updateWebApplication = async function (req, res) {
  try {
    let errors = valiator.validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, errors: errors.array() })
    }

    let server = req.server
    let application = await Application.findById(req.params.id)
    if (!application) {
      return res.status(422).json({
        success: false,
        errors: { name: "invalid application" }
      })
    }

    application.publicPath =(req.body.publicPath)?req.body.publicPath:application.publicPath
    application.stack =req.body.stack
    application.stackMode =req.body.stackMode
    application.settings = {
        "disableFunctions": req.body.disableFunctions,
        "timezone": req.body.timezone,
        "maxExecutionTime": req.body.maxExecutionTime,
        "maxInputTime": req.body.maxExecutionTime,
        "maxInputVars": req.body.maxInputVars,
        "memoryLimit": req.body.memoryLimit,
        "postMaxSize": req.body.postMaxSize,
        "uploadMaxFilesize": req.body.uploadMaxFilesize,
        "allowUrlFopen": req.body.allowUrlFopen,
        "sessionGcMaxlifetime": req.body.sessionGcMaxlifetime,
        "processManager": req.body.processManager,
        "processManagerStartServers": req.body.processManagerStartServers,
        "processManagerMinSpareServers": req.body.processManagerMinSpareServers,
        "processManagerMaxSpareServers": req.body.processManagerMaxSpareServers,
        "processManagerMaxChildren": req.body.processManagerMaxChildren,
        "processManagerMaxRequests": req.body.processManagerMaxRequests,
        "openBasedir": req.body.openBasedir,
        "clickjackingProtection": req.body.clickjackingProtection,
        "xssProtection": req.body.xssProtection,
        "mimeSniffingProtection": req.body.mimeSniffingProtection
    }

    errors = await agent.updateWebApplication(application)
    if (errors) {
      return res.status(422).json({
        success: false,
        errors: errors
      })
    }

    await application.save()

    const message = `Update PHP-FPM, NGiNX`;
    await activity.createServerActivityLogInfo(server.id, message)

    res.json({
      success: true,
      message: "It has been successfully updated.",
      data:application
    })
  }
  catch (e) {
    console.error(e)
    return res.status(501).json({ success: false });
  }
}

const setDefaultApp = async function(req, res){
  try {
    const application = await Application.findById(req.params.id)
    if (!application) {
      return res.status(501).json({ 
        success: false,
        message: "Invalid application"
      });
    }

    errors = await agent.setDefaultApp(application)
    if (errors) {
      return res.status(422).json({
        success: false,
        errors: errors
      })
    }

    application.defaultApp = true
    await application.save()

    return res.json({ 
      success: true,
      message:"set default app",
      data: application
    })
  }
  catch (e) {
    console.error(e)
    return res.status(501).json({ success: false });
  }
}

const changePHPversion = async function(req, res){
  try {
    let errors = valiator.validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, errors: errors.array() })
    }

    const application = await Application.findById(req.params.id)
    if (!application) {
      return res.status(501).json({ 
        success: false,
        message: "Invalid application"
      });
    }

    application.phpVersion = req.body.phpVersion
    await application.save()

    return res.json({ 
      success: true,
      message:"change PHP version",
      data: application
    })
  }
  catch (e) {
    console.error(e)
    return res.status(501).json({ success: false });
  }
}

const removeDefaultApp = async function(req, res){
  try {
    const application = await Application.findById(req.params.id)
    if (!application) {
      return res.status(501).json({ 
        success: false,
        message: "Invalid application"
      });
    }

    errors = await agent.removeDefaultApp(application)
    if (errors) {
      return res.status(422).json({
        success: false,
        errors: errors
      })
    }

    application.defaultApp = false
    await application.save()

    return res.json({ 
      success: true,
      message:"remove default app",
      data: application
    })
  }
  catch (e) {
    console.error(e)
    return res.status(501).json({ success: false });
  }
}

const rebuildApp = async function(req, res){
  try {
    const application = await Application.findById(req.params.id)
    if (!application) {
      return res.status(501).json({ 
        success: false,
        message: "Invalid application"
      });
    }

    // ___________ rebuild code

    return res.json({ 
      success: true,
      message:"set default app",
      data: application
    })
  }
  catch (e) {
    console.error(e)
    return res.status(501).json({ success: false });
  }
}

const cloningGITrepository = async function(req, res){
  try {
    let errors = valiator.validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, errors: errors.array() })
    }

    let repository = await GitRepository.findOne({ applicationId: req.params.id})
    if (repository) {
      return res.status(422).json({
        success: false,
        errors: { applicationId: "has already been taken." }
      })
    }

    req.body.repositoryData = {
      "url": "https:\/\/github.com\/"+req.body.repository,
      "repo": "git@github.com:"+req.body.repository
    }
     
    repository = new GitRepository(req.body)
    repository.applicationId = req.params.id
    await repository.save()

    res.json({
      success: true,
      message: "It has been successfully created.",
      data:repository
    })
  }
  catch (e) {
    console.error(e)
    return res.status(501).json({ success: false });
  }
}

const getGITrepository = async function(req, res){
    try {
      const repository = await GitRepository.findOne({ applicationId: req.params.id })
      return res.json({ 
        success: true,
        data: repository
      })
    }
    catch (e) {
      console.error(e)
      return res.status(501).json({ success: false });
    }
}

const changeGITbranch = async function(req, res){
  try {
    let errors = valiator.validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, errors: errors.array() })
    }

    const repository = await GitRepository.findById(req.params.gitId)
    if (!repository) {
      return res.status(501).json({ 
        success: false,
        message: "Invalid GITRepository"
      });
    }

    repository.branch = req.body.branch
    await repository.save()

    return res.json({ 
      success: true,
      message:"change branch",
      data: repository
    })
  }
  catch (e) {
    console.error(e)
    return res.status(501).json({ success: false });
  }
}

const customizeGITscript = async function(req, res){
  try {
    let errors = valiator.validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, errors: errors.array() })
    }

    const repository = await GitRepository.findById(req.params.gitId)
    if (!repository) {
      return res.status(501).json({ 
        success: false,
        message: "Invalid GITRepository"
      });
    }

    repository.autoDeploy = req.body.autoDeploy
    repository.deployScript = req.body.deployScript
    await repository.save()

    return res.json({ 
      success: true,
      message:"Customize GIT deployment script",
      data: repository
    })
  }
  catch (e) {
    console.error(e)
    return res.status(501).json({ success: false });
  }
}

const forceDeploymentbyscript = async function(req, res){
  try {

    const repository = await GitRepository.findById(req.params.gitId)
    if (!repository) {
      return res.status(501).json({ 
        success: false,
        message: "Invalid GITRepository"
      });
    }

    // _______________ force deployment code here

    return res.json({ 
      success: true,
      message:"Customize GIT deployment script",
      data: repository
    })
  }
  catch (e) {
    console.error(e)
    return res.status(501).json({ success: false });
  }
}

const removeGITreository = async function(req, res){
  try {
    const repository = await GitRepository.findOne({ applicationId: req.params.webAppId, _id:req.params.gitId})
    if (!repository) {
      return res.status(422).json({
        success: false,
        errors: { 
          message: "It doesn't exists",
        }
      })
    }

    await repository.remove()

    res.json({
      success: true,
      message: "It has been successfully deleted."
    })
  }
  catch (error) {
    return res.status(501).json({ 
      success: false,
      errors: error
    });
  }
}

const installPHPscript = async function(req, res){
  try {
    let errors = valiator.validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, errors: errors.array() })
    }

    let installer = await Installer.findOne({ applicationId: req.params.webAppId})
    if (installer) {
      return res.status(422).json({
        success: false,
        errors: { applicationId: "has already been taken." }
      })
    }

    req.body.realName = req.body.name
     
    installer = new Installer(req.body)
    installer.applicationId = req.params.webAppId
    await installer.save()

    res.json({
      success: true,
      message: "It has been successfully created.",
      data:installer
    })
  }
  catch (e) {
    console.error(e)
    return res.status(501).json({ success: false });
  }
}

const getPHPscript = async function(req, res){
  try {
    const installer = await Installer.findOne({ applicationId: req.params.webAppId })
    return res.json({ 
      success: true,
      data: installer
    })
  }
  catch (e) {
    console.error(e)
    return res.status(501).json({ success: false });
  }
}

const removePHPscript = async function(req, res){
  try {
    const installer = await Installer.findOne({ applicationId: req.params.webAppId, _id:req.params.installerId})
    if (!installer) {
      return res.status(422).json({
        success: false,
        errors: { 
          message: "It doesn't exists",
        }
      })
    }

    await installer.remove()

    res.json({
      success: true,
      message: "It has been successfully deleted."
    })
  }
  catch (error) {
    return res.status(501).json({ 
      success: false,
      errors: error
    });
  }
}

const addDomainname = async function(req, res){
  try {
    let errors = valiator.validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, errors: errors.array() })
    }

    let domain = await Domains.findOne({ applicationId: req.params.webAppId,name:req.body.name})
    if (domain) {
      return res.status(422).json({
        success: false,
        errors: { applicationId: "has already been taken." }
      })
    }

    req.body.realName = req.body.name
     
    domain = new Domains(req.body)
    domain.applicationId = req.params.webAppId
    await domain.save()

    res.json({
      success: true,
      message: "It has been successfully created.",
      data:domain
    })
  }
  catch (e) {
    console.error(e)
    return res.status(501).json({ success: false });
  }
}

const getDomainlist = async function(req, res){
  try {
    const domains = await Domains.find({ applicationId: req.params.webAppId})
    return res.json({ 
      success: true,
      data: domains
    })
  }
  catch (e) {
    console.error(e)
    return res.status(501).json({ success: false });
  }
}

const getDomain = async function(req, res){
  try {
    const domain = await Domains.findById(req.params.domainId)
    return res.json({ 
      success: true,
      data: domain
    })
  }
  catch (e) {
    console.error(e)
    return res.status(501).json({ success: false });
  }
}

const removeDomain = async function(req, res){
  try {
    const domain = await Domains.findOne({ applicationId: req.params.webAppId, _id:req.params.domainId})
    if (!domain) {
      return res.status(422).json({
        success: false,
        errors: { 
          message: "It doesn't exists",
        }
      })
    }

    await domain.remove()

    res.json({
      success: true,
      message: "It has been successfully deleted."
    })
  }
  catch (error) {
    return res.status(501).json({ 
      success: false,
      errors: error
    });
  }
}

const installSSL = async function(req, res){
  try {
    let errors = valiator.validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, errors: errors.array() })
    }

    let basicSSL = await BasicSSL.findOne({ applicationId: req.params.webAppId})
    if (basicSSL) {
      return res.status(422).json({
        success: false,
        errors: { applicationId: "has already been taken." }
      })
    }

    req.body.method = req.body.provider
     
    basicSSL = new BasicSSL(req.body)
    basicSSL.applicationId = req.params.webAppId
    await basicSSL.save()

    res.json({
      success: true,
      message: "It has been successfully created.",
      data:basicSSL
    })
  }
  catch (e) {
    console.error(e)
    return res.status(501).json({ success: false });
  }
}

const getSSL = async function(req, res){
  try {
    const basicSSL = await BasicSSL.findOne({ applicationId: req.params.webAppId})
    return res.json({ 
      success: true,
      data: basicSSL
    })
  }
  catch (e) {
    console.error(e)
    return res.status(501).json({ success: false });
  }
}

const updateSSL = async function(req, res){
  try {
    let errors = valiator.validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, errors: errors.array() })
    }

    const basicSSL = await BasicSSL.findById(req.params.sslId)
    if (!basicSSL) {
      return res.status(501).json({ 
        success: false,
        message: "Invalid GITRepository"
      });
    }

    Object.assign(basicSSL, req.body)
    
    await basicSSL.save()

    return res.json({ 
      success: true,
      message:"update ssl",
      data: basicSSL
    })
  }
  catch (e) {
    console.error(e)
    return res.status(501).json({ success: false });
  }
}

const redeploySSL = async function(req, res){
  try {
    const basicSSL = await BasicSSL.findById(req.params.sslId)
    return res.json({ 
      success: true,
      data: basicSSL
    })
  }
  //+++++++++++ here redeploySSL code

  catch (e) {
    console.error(e)
    return res.status(501).json({ success: false });
  }
}

const removeSSL = async function(req, res){
  try {
    const basicSSL = await BasicSSL.findById(req.params.sslId)
    if (!basicSSL) {
      return res.status(422).json({
        success: false,
        errors: { 
          message: "It doesn't exists",
        }
      })
    }

    await basicSSL.remove()

    res.json({
      success: true,
      message: "It has been successfully deleted."
    })
  }
  catch (error) {
    return res.status(501).json({ 
      success: false,
      errors: error
    });
  }
}

const getadvancedSSLsetting = async function(req, res){
  try {
    const application = await Application.findById(req.params.webAppId)
    return res.json({ 
      success: true,
      data: application.advancedSSL
    })
  }
  catch (e) {
    console.error(e)
    return res.status(501).json({ success: false });
  }
}

const switchingadvancedSSLsetting = async function(req, res){
  try {
    let errors = valiator.validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, errors: errors.array() })
    }

    const application = await Application.findById(req.params.webAppId)
    if (!application) {
      return res.status(501).json({ 
        success: false,
        message: "Invalid application"
      });
    }

    Object.assign(application.advancedSSL, req.body)
    
    await application.save()

    return res.json({ 
      success: true,
      message:"Advanced switching ssl",
      data: application.advancedSSL
    })
  }
  catch (e) {
    console.error(e)
    return res.status(501).json({ success: false });
  }
}

const installadvancedSSL = async function(req, res){
  try {
    let errors = valiator.validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, errors: errors.array() })
    }

    let advancedSSL = await AdvancedSSL.findOne({ applicationId: req.params.webAppId,domainId: req.params.domainId})
    if (advancedSSL) {
      return res.status(422).json({
        success: false,
        errors: { applicationId: "has already been taken." }
      })
    }

    req.body.method = req.body.provider
     
    advancedSSL = new AdvancedSSL(req.body)
    advancedSSL.applicationId = req.params.webAppId
    advancedSSL.domainId = req.params.domainId
    await advancedSSL.save()

    res.json({
      success: true,
      message: "It has been successfully created.",
      data:advancedSSL
    })
  }
  catch (e) {
    console.error(e)
    return res.status(501).json({ success: false });
  }
}

const getadvancedSSL = async function(req, res){
  try {
    const advancedSSL = await AdvancedSSL.findOne({ applicationId: req.params.webAppId,domainId: req.params.domainId})
    return res.json({ 
      success: true,
      data: advancedSSL
    })
  }
  catch (e) {
    console.error(e)
    return res.status(501).json({ success: false });
  }
}

const updateadvancedSSL = async function(req, res){
  try {
    let errors = valiator.validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, errors: errors.array() })
    }

    const advancedSSL = await AdvancedSSL.findById(req.params.sslId)
    if (!advancedSSL) {
      return res.status(501).json({ 
        success: false,
        message: "Invalid GITRepository"
      });
    }

    Object.assign(advancedSSL, req.body)
    
    await advancedSSL.save()

    return res.json({ 
      success: true,
      message:"update ssl",
      data: advancedSSL
    })
  }
  catch (e) {
    console.error(e)
    return res.status(501).json({ success: false });
  }
}

const redeployadvancedSSL = async function(req, res){
  try {
    const advancedSSL = await AdvancedSSL.findById(req.params.sslId)
    return res.json({ 
      success: true,
      data: advancedSSL
    })
  }
  //+++++++++++ here redeploySSL code

  catch (e) {
    console.error(e)
    return res.status(501).json({ success: false });
  }
}

const removeadvancedSSL = async function(req, res){
  try {
    const advancedSSL = await AdvancedSSL.findById(req.params.sslId)
    if (!advancedSSL) {
      return res.status(422).json({
        success: false,
        errors: { 
          message: "It doesn't exists",
        }
      })
    }

    await advancedSSL.remove()

    res.json({
      success: true,
      message: "It has been successfully deleted."
    })
  }
  catch (error) {
    return res.status(501).json({ 
      success: false,
      errors: error
    });
  }
}

const storeWebApplication = async function (req, res) {
  try {
    let errors = valiator.validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, errors: errors.array() })
    }

    let server = req.server
    let application = await Application.findOne({ serverId: server.id, name: req.body.name })
    if (application) {
      return res.status(422).json({
        success: false,
        errors: { name: "has already been taken." }
      })
    }

    errors = await agent.createWebApplication(req.body)
    if (errors) {
      return res.status(422).json({
        success: false,
        errors: errors
      })
    }

    application = new Application(req.body)
    application.serverId = server.id
    await application.save()

    const message = `Added new web application ${req.body.name}`;
    await activity.createServerActivityLogInfo(server.id, message)

    res.json({
      success: true,
      message: "It has been successfully created."
    })
  }
  catch (e) {
    console.error(e)
    return res.status(501).json({ success: false });
  }
}

const storeWordpressWebApplication = async function (req, res) {
  try {
    let errors = valiator.validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, errors: errors.array() })
    }

    let server = req.server
    let application = await Application.findOne({ serverId: server.id, name: req.body.name })
    if (application) {
      return res.status(422).json({
        success: false,
        errors: { name: "has already been taken." }
      })
    }

    errors = await agent.createWebApplication(req.body)
    if (errors) {
      return res.status(422).json({
        success: false,
        errors: errors
      })
    }

    application = new Application(req.body)
    application.serverId = server.id
    await application.save()

    const message = `Added new web application ${req.body.name}`;
    await activity.createServerActivityLogInfo(server.id, message)

    res.json({
      success: true,
      message: "It has been successfully created."
    })
  }
  catch (e) {
    console.error(e)
    return res.status(501).json({ success: false });
  }
}

const deleteWebApplication = async function (req, res) {
  try {
    let {server, errors} = await getServer(req)
    if (errors) {
      return res.status(422).json({ success: false, errors: errors })
    }

    const index = server.applications.findIndex(it => it._id === req.params.webAppId);
    if (index < 0) {
      return res.status(422).json({
        success: false,
        errors: { 
          message: "It doesn't exists",
        }
      })
    }

    errors = await agent.deleteWebApplication(req.params.webAppId)
    if (errors) {
      return res.status(422).json({
        success: false,
        errors: errors
      })
    }

    server.applications.splice(index, 1)
    await server.save()

    res.json({
      success: true,
      message: "It has been successfully deleted."
    })
  }
  catch (error) {
    return res.status(501).json({ 
      success: false,
      errors: error
    });
  }
}

module.exports = {
  getWebApplications,
  getWebApplication,
  getapplicationsettings,
  changePHPversion,
  webApplication,
  createWebApplication,
  updateWebApplication,
  setDefaultApp,
  rebuildApp,
  removeDefaultApp,

  cloningGITrepository,
  getGITrepository,
  changeGITbranch,
  customizeGITscript,
  forceDeploymentbyscript,
  removeGITreository,

  installPHPscript,
  getPHPscript,
  removePHPscript,

  addDomainname,
  getDomainlist,
  getDomain,
  removeDomain,

  installSSL,
  getSSL,
  updateSSL,
  redeploySSL,
  removeSSL,

  installadvancedSSL,
  getadvancedSSL,
  updateadvancedSSL,
  redeployadvancedSSL,
  removeadvancedSSL,

  getadvancedSSLsetting,
  switchingadvancedSSLsetting,


  storeCustomWebApplication,
  storeWordpressWebApplication,
  deleteWebApplication,
}
