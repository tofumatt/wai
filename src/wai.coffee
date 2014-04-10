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
  # Display an install prompt, allowing the user to install this app to their
  # device. Takes an `options` argument, which is actually a hash of args:
  #
  # * numberOfPrompts: number of times to prompt the user to install the
  #                    app. If undefined or a non-truthy value, it will
  #                    ignored and app install will only be attempted
  #                    once. Defaults to `undefined`.
  #
  # * onlyPromptOnce: only prompt the user for install once. Useful if you
  #                   display a prompt on page load rather than when a user
  #                   taps a button in your app. Defaults to `false`.
  #
  # * success:        success callback, run if the user accepts the install and
  #                   it takes place with no errors. The first argument passed
  #                   to the callback is the [App object](app), while the
  #                   second is the [DOMRequest object](domreq).
  #
  # * error:          error callback, run if the user accepts the install, but
  #                   it fails. The first argument passed to the callback is
  #                   the [error object](error), while the second is the
  #                   [DOMRequest object](domreq).
  #
  # [app]: https://developer.mozilla.org/en-US/docs/Web/API/App
  # [domreq]: https://developer.mozilla.org/en-US/docs/Web/API/DOMRequest
  # [error]: https://developer.mozilla.org/en-US/docs/Web/API/Apps.install#Error
  install: (manifest, options) ->
    # Was manifest assumed and thus options passed as the first argument?
    # That's cool.
    if typeof manifest is "object"
      options = manifest
      manifest = null

    # Check to see if an install with Wai has been attempted in the past.
    installAttempts = parseInt(store._waiAttemptedAppInstall, 10) or 0

    # If mozApps isn't available the platform isn't supported and we quit.
    return if !mozApps or (store._waiAttemptedAppInstall and
      ((options.onlyPromptOnce and installAttempts) or
      installAttempts >= options.numberOfPrompts)
    )

    # If this is a Mozilla app, check to see if it's installed already.
    if mozApps
      checkIfInstalled = mozApps.getSelf()
      checkIfInstalled.addEventListener "success", ->
        # The app is already installed, so let's get out of here.
        return if checkIfInstalled.result

        # Setup a handler to set if the app went uninstalled on page unload.
        window.addEventListener "beforeunload", (event) ->
          # We use localStorage not only because it's the most cross-browser
          # compatible and lightweight, but because async APIs have problems
          # on `beforeunload`.
          #
          # See: https://github.com/mozilla/localForage/issues/131
          if store._waiAppIsInstalled
            store._waiAttemptedAppInstall = '0'
          else
            store._waiAttemptedAppInstall = (installAttempts + 1).toString()

        if manifest
          manifestURL = manifest
          manifestURL = "#{window.location.protocol}//\
                         #{manifestURL}" unless manifestURL.match /^https?:\/\//
        else
          manifestURL = "#{window.location.protocol}//#{window.location.host}\
                         /manifest.webapp"

        domRequest = mozApps.install(manifestURL)

        # Callbacks for each install outcome.
        domRequest.addEventListener "success", ->
          store._waiAppIsInstalled = '1'
          options.success(domRequest.result, domRequest) if options.success

        # App install failed.
        domRequest.addEventListener "error", ->
          options.error(domRequest.result, domRequest) if options.error

# See what kind of module system we've got going on and load in WAI
# appropriately.
if typeof define is "function" and define.amd
  define -> Wai
else if typeof module isnt "undefined" and module.exports
  module.exports = Wai
else
  this.Wai = Wai
