const { body } = require('express-validator')
const router = require("express").Router()
const auth = require("../auth")
const application = require("../../services/webapps")

router.get("/", 
  auth.required, 
  application.getWebApplications)

router.get("/create", 
  auth.required, 
  application.webApplication)

router.get("/:id", 
  auth.required, 
  application.getWebApplication)

router.get("/:id/settings", 
  auth.required, 
  application.getapplicationsettings)



router.post("/custom",
  auth.required,
  body('name').isString(),
  body('domainName').isString(),
  body('user').isNumeric(),
  body('phpVersion').isString(),
  body('stack').isString(),
  body('stackMode').isString(),
  
  body('clickjackingProtection').isBoolean(),
  body('xssProtection').isBoolean(),
  body('mimeSniffingProtection').isBoolean(),
  body('processManager').isString(),
  
  body('processManagerMaxChildren').custom((val, { req, loc, path }) => {
      if (req.body.processManager == "dynamic") {
          body('processManagerMaxChildren').isNumeric()
      } else {
          return true;
      }
  }),
  body('processManagerMaxRequests').custom((val, { req, loc, path }) => {
    if (req.body.processManager == "dynamic") {
        body('processManagerMaxChildren').isNumeric()
    } else {
        return true;
    }
  }),
  body('openBasedir').isString(),
  body('timezone').isString(),
  body('disableFunctions').isString(),
  body('maxExecutionTime').isNumeric(),
  body('maxInputTime').isNumeric(),
  body('maxInputVars').isNumeric(),
  body('memoryLimit').isNumeric(),
  body('postMaxSize').isNumeric(),
  body('uploadMaxFilesize').isNumeric(),
  body('sessionGcMaxlifetime').isNumeric(),
  body('allowUrlFopen').isBoolean(),
  application.createWebApplication)

router.post("/:id/default", 
  auth.required, 
  application.setDefaultApp)

router.delete("/:id/default", 
  auth.required, 
  application.removeDefaultApp)

router.patch("/:id/settings/php",
  auth.required, 
  body('phpVersion').isString(),
  application.changePHPversion)

router.patch("/:id/settings/fpmnginx",
  auth.required, 
  body('stack').isString(),
  body('stackMode').isString(),
  body('clickjackingProtection').isBoolean(),
  body('xssProtection').isBoolean(),
  body('mimeSniffingProtection').isBoolean(),
  body('processManager').isString(),
  body('processManagerMaxChildren').custom((val, { req, loc, path }) => {
    if (req.body.processManager == "dynamic") {
        body('processManagerMaxChildren').isNumeric()
    } else {
        return true;
    }
  }),
  body('processManagerMaxRequests').custom((val, { req, loc, path }) => {
    if (req.body.processManager == "dynamic") {
        body('processManagerMaxChildren').isNumeric()
    } else {
        return true;
    }
  }),
  body('openBasedir').isString(),
  body('timezone').isString(),
  body('disableFunctions').isString(),
  body('maxExecutionTime').isNumeric(),
  body('maxInputTime').isNumeric(),
  body('maxInputVars').isNumeric(),
  body('memoryLimit').isNumeric(),
  body('postMaxSize').isNumeric(),
  body('uploadMaxFilesize').isNumeric(),
  body('sessionGcMaxlifetime').isNumeric(),
  body('allowUrlFopen').isBoolean(),
  application.updateWebApplication)

router.patch("/:id/rebuild", 
  auth.required, 
  application.rebuildApp)


router.post("/:id/git", 
  auth.required, 
  body('provider').isString(), //"custom", "bitbucket", "github", "gitlab", "selfhostedgitlab"
  body('repository').isString(), 
  body('branch').isString(),
  body('gitUser').custom((val, { req, loc, path }) => {
      if (req.body.provider == "CUSTOM" || req.body.provider == "SELFHOSTEDGITLAB") {
          body('processManagerMaxChildren').isString()
      } else {
          return true;
      }
  }),
  body('gitHost').custom((val, { req, loc, path }) => {
      if (req.body.provider == "CUSTOM" || req.body.provider == "SELFHOSTEDGITLAB") {
          body('processManagerMaxChildren').isString()
      } else {
          return true;
      }
  }),
  application.cloningGITrepository)

  router.get("/:id/git", 
      auth.required, 
      application.getGITrepository)

  router.patch("/:webAppId/git/:gitId/branch", 
    auth.required, 
    body('branch').isString(),
    application.changeGITbranch)

  router.patch("/:webAppId/git/:gitId/script", 
    auth.required, 
    body('autoDeploy').isBoolean(),
    application.customizeGITscript)
  
  router.put("/:webAppId/git/:gitId/script", 
    auth.required, 
    body('autoDeploy').isBoolean(),
    application.forceDeploymentbyscript)

  router.delete("/:webAppId/git/:gitId", 
    auth.required, 
    application.removeGITreository)



  router.post("/:webAppId/installer", 
    auth.required, 
    body('name').isString(),
    application.installPHPscript)
  
  router.get("/:webAppId/installer", 
    auth.required, 
    application.getPHPscript)

  router.delete("/:webAppId/installer/:installerId", 
    auth.required, 
    application.removePHPscript)



  router.post("/:webAppId/domains", 
    auth.required, 
    body('name').isString(),
    application.addDomainname)
  
  router.get("/:webAppId/domains", 
    auth.required, 
    application.getDomainlist)
  
  router.get("/:webAppId/domains/:domainId", 
    auth.required, 
    application.getDomain)

  router.delete("/:webAppId/domains/:domainId", 
    auth.required, 
    application.removeDomain)



  router.post("/:webAppId/ssl", 
    auth.required, 
    body('provider').isString(),
    body('enableHsts').isBoolean(),
    body('enableHttp').isBoolean(),
    body('ssl_protocol_id').isNumeric(),
    application.installSSL)
  
  router.get("/:webAppId/ssl", 
    auth.required, 
    application.getSSL)

  router.patch("/:webAppId/ssl/:sslId", 
    auth.required, 
    body('enableHsts').isBoolean(),
    body('enableHttp').isBoolean(),
    body('ssl_protocol_id').isNumeric(),
    application.updateSSL)

  router.put("/:webAppId/ssl/:sslId", 
    auth.required, 
    application.redeploySSL)

  router.delete("/:webAppId/ssl/:sslId", 
    auth.required, 
    application.removeSSL)



  router.get("/:webAppId/ssl/advanced", 
    auth.required, 
    application.getadvancedSSLsetting)

  router.post("/:webAppId/ssl/advanced", 
    auth.required, 
    body('advancedSSL').isBoolean(),
    application.switchingadvancedSSLsetting)





  router.post("/:webAppId/domains/:domainId/ssl", 
    auth.required, 
    body('provider').isString(),
    body('enableHsts').isBoolean(),
    body('enableHttp').isBoolean(),
    application.installadvancedSSL)
  
  router.get("/:webAppId/domains/:domainId/ssl", 
    auth.required, 
    application.getadvancedSSL)

  router.patch("/:webAppId/domains/:domainId/ssl/:sslId", 
    auth.required, 
    body('enableHsts').isBoolean(),
    body('enableHttp').isBoolean(),
    application.updateadvancedSSL)

  router.put("/:webAppId/domains/:domainId/ssl/:sslId", 
    auth.required, 
    application.redeployadvancedSSL)

  router.delete("/:webAppId/domains/:domainId/ssl/:sslId", 
    auth.required, 
    application.removeadvancedSSL)

  router.get("/:webAppId/settings", 
    auth.required, 
    application.getapplicationsettings)




// router.post("/store/custom",
//   auth.required,
//   body('serverId').isString(),
//   body('name').isString(),
//   body('domainSelection').isString(),
//   body('domainName').isString(),
//   body('useExistingUser').isBoolean(),
//   body('user').isString(),
//   body('newUser').isString(),
//   body('publicPath').isString(),
//   body('phpVersion').isString(),
//   body('stack').isString(),
//   body('stackMode').isString(),
//   body('advanceSetting').isBoolean(),
//   /*body('clickjackingProtection').isBoolean(),
//   body('xssProtection').isBoolean(),
//   body('mimeSniffingProtection').isBoolean(),
//   body('proxyProtocol').isBoolean(),
//   body('processManager').isString(),
//   body('processManagerStartServers').isNumeric(),
//   body('processManagerMinSpareServers').isNumeric(),
//   body('processManagerMaxSpareServers').isNumeric(),
//   body('processManagerMaxChildren').isNumeric(),
//   body('processManagerMaxRequests').isNumeric(),
//   body('openBasedir').isString(),
//   body('timezone').isString(),
//   body('disableFunctions').isString(),
//   body('maxExecutionTime').isNumeric(),*/
//   application.storeCustomWebApplication)


router.post("/store/wordpress",
  auth.required,
  body('serverId').isString(),
  body('name').isString(),
  body('domainSelection').isString(),
  body('domainName').isString(),
  body('useExistingUser').isBoolean(),
  body('user').isString(),
  body('newUser').isString(),
  body('publicPath').isString(),
  body('phpVersion').isString(),
  body('stack').isString(),
  body('stackMode').isString(),
  body('advanceSetting').isBoolean(),
  /*body('clickjackingProtection').isBoolean(),
  body('xssProtection').isBoolean(),
  body('mimeSniffingProtection').isBoolean(),
  body('proxyProtocol').isBoolean(),
  body('processManager').isString(),
  body('processManagerStartServers').isNumeric(),
  body('processManagerMinSpareServers').isNumeric(),
  body('processManagerMaxSpareServers').isNumeric(),
  body('processManagerMaxChildren').isNumeric(),
  body('processManagerMaxRequests').isNumeric(),
  body('openBasedir').isString(),
  body('timezone').isString(),
  body('disableFunctions').isString(),
  body('maxExecutionTime').isNumeric(),*/
  application.storeWordpressWebApplication)

router.delete("/:webAppId",
  auth.required,
  application.deleteWebApplication)

module.exports = router
