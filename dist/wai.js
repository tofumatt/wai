
/*!
  wai -- https://github.com/tofumatt/wai
  Version 0.1.0
  (c) 2014 tofumatt, MIT License
 */

(function() {
  "use strict";
  var Wai, mozApps, store;

  mozApps = this.navigator.mozApps;

  store = this.localStorage;

  Wai = {
    install: function(options) {
      var checkIfInstalled, installAttempts;
      installAttempts = parseInt(store._waiAttemptedAppInstall, 10) || 0;
      if (!mozApps || (store._waiAttemptedAppInstall && ((options.onlyPromptOnce && installAttempts) || installAttempts >= options.numberOfPrompts))) {
        return;
      }
      if (mozApps) {
        checkIfInstalled = mozApps.getSelf();
        return checkIfInstalled.addEventListener("success", function() {
          var domRequest, manifestURL;
          if (checkIfInstalled.result) {
            return;
          }
          window.addEventListener("beforeunload", function(event) {
            if (store._waiAppIsInstalled) {
              return store._waiAttemptedAppInstall = '0';
            } else {
              return store._waiAttemptedAppInstall = (installAttempts + 1).toString();
            }
          });
          if (options.manifest) {
            manifestURL = options.manifest;
            if (!manifestURL.match(/^https?:\/\//)) {
              manifestURL = "" + window.location.protocol + "//" + manifestURL;
            }
          } else {
            manifestURL = "" + window.location.protocol + "//" + window.location.host + "/manifest.webapp";
          }
          domRequest = mozApps.install(manifestURL);
          domRequest.addEventListener("success", function() {
            parseInt(store._waiAttemptedAppInstall, 10);
            store._waiAppIsInstalled = '1';
            if (options.success) {
              return options.success(domRequest.result, domRequest);
            }
          });
          return domRequest.addEventListener("error", function() {
            if (options.error) {
              return options.error(domRequest.result, domRequest);
            }
          });
        });
      }
    }
  };

  if (typeof define === "function" && define.amd) {
    define(function() {
      return Wai;
    });
  } else if (typeof module !== "undefined" && module.exports) {
    module.exports = Wai;
  } else {
    this.Wai = Wai;
  }

}).call(this);
