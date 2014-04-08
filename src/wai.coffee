###!
  wai -- https://github.com/tofumatt/wai
  Version 0.1.0
  (c) 2014 tofumatt, MIT License
###
# This file is built from CoffeeScript.
"use strict"

# What kind of app install process are we dealing with?
mozApps = @navigator.mozApps

# Use localStorage to set install info.
store = @localStorage # or window.localStorage

Wai =
  install: (options) =>
    return if !mozApps or store._waiAttemptedAppInstall

    # If this is a Mozilla app, check to see if it's installed already.
    if mozApps
      checkIfInstalled = mozApps.getSelf()
      checkIfInstalled.addEventListener "success", ->
        return if checkIfInstalled.result

        # Setup a handler to set if the app went uninstalled on page unload.
        window.addEventListener "beforeunload", (event) ->
          store._waiAttemptedAppInstall = if store._waiAttemptedAppInstall
          then (parseInt(store._waiAttemptedAppInstall, 10) + 1).toString()
          else '1'

        if options.manifest
          manifestURL = options.manifest
          manifestURL = "#{window.location.protocol}//#{manifestURL}" unless manifestURL.match /^https?:\/\//
        else
          manifestURL = "#{window.location.protocol}//#{window.location.host}\
                         /manifest.webapp"

        installApp = mozApps.install(manifestURL)

        # Callbacks for each install outcome.
        installApp.addEventListener "success", (data) ->
          store._waiAppIsInstalled = '1'
          options.success(data) if options.success

        # App install failed.
        installApp.addEventListener "error", (data) ->
          options.error(data) if options.error

# See what kind of module system we've got going on and load in WAI
# appropriately.
if typeof define is "function" and define.amd
  define -> Wai
else if typeof module isnt "undefined" and module.exports
  module.exports = Wai
else
  this.Wai = Wai
