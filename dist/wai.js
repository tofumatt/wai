
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
    install: (function(_this) {
      return function(options) {
        var checkIfInstalled;
        if (!mozApps || store._waiAttemptedAppInstall) {
          return;
        }
        if (mozApps) {
          checkIfInstalled = mozApps.getSelf();
          return checkIfInstalled.addEventListener("success", function() {
            var installApp, manifestURL;
            if (checkIfInstalled.result) {
              return;
            }
            window.addEventListener("beforeunload", function(event) {
              return store._waiAttemptedAppInstall = store._waiAttemptedAppInstall ? (parseInt(store._waiAttemptedAppInstall, 10) + 1).toString() : '1';
            });
            if (options.manifest) {
              manifestURL = options.manifest;
              if (!manifestURL.match(/^https?:\/\//)) {
                manifestURL = "" + window.location.protocol + "//" + manifestURL;
              }
            } else {
              manifestURL = "" + window.location.protocol + "//" + window.location.host + "/manifest.webapp";
            }
            installApp = mozApps.install(manifestURL);
            installApp.addEventListener("success", function(data) {
              store._waiAppIsInstalled = '1';
              if (options.success) {
                return options.success(data);
              }
            });
            return installApp.addEventListener("error", function(data) {
              if (options.error) {
                return options.error(data);
              }
            });
          });
        }
      };
    })(this)
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
