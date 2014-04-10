---
title: wai API Reference

language_tabs:
  - javascript
  - coffeescript

toc_footers:
  - <a href="https://github.com/tofumatt/wai">Source Code</a>
  - <a href="https://github.com/tripit/slate">(Docs Powered by Slate)</a>

---

# wai ไหว้

```javascript
// Prompt to install our app as an Open Web App as soon as the page has loaded.
Wai.install({
    manifest: 'http://mywebapp.com/manifest.webapp',
    success: function(data) {
        console.log(data);
    },
    error: function(data) {
        console.error(data);
    }
})
```

```coffeescript
# In localStorage, we would do:
localStorage.setItem "key", JSON.stringify("value")
doSomethingElse()

# With localForage, we use callbacks:
localforage.setItem "key", "value", doSomethingElse

# Or we can use Promises:
localforage.setItem("key", "value").then doSomethingElse
```

**Install web apps from your own site.**

Wai is a simple library that allows you to install your [Open Web App](owa)
from any site, including its own domain. While apps can be installed from the
[Firefox Marketplace](market), you may wish to also allow installs from your
own domain. This library lets you call one method (`Wai.install()`) to install
the app, provided the user's browser is capable.

[Download Wai on GitHub.](https://github.com/tofumatt/wai/releases)

ขอบคุณ!

[market]: http://marketplace.firefox.com/
[owa]: https://developer.mozilla.org/en-US/Apps/Quickstart

# Installation

``` bash
# Optional installation with bower:
bower install wai
```
``` html
<script src="wai.js"></script>
<script>Wai.install();</script>
```

Install Wai by including it in your page. You can run the install code as soon
as Wai is ready; it has no dependencies and doesn't rely on any `ready` events.

# API

## install

```javascript
Wai.install('http://myapp.com/manifest.webapp', {
    onlyPromptOnce: true, // Only prompt for install the first time
                          // the user visits this site. Useful if
                          // you don't want the user to click a
                          // button to initiate install, but don't
                          // want to bug them every site visit if
                          // they chose not to install the app.
    success: function() {
        alert('Thanks for installing my app!');
    },
    error: function() {
        alert('There was an error; please contact support.')
    }
});
```

```coffeescript
Wai.install "http://myapp.com/manifest.webapp",
  onlyPromptOnce: true # Only prompt for install the first time
                       # the user visits this site. Useful if
                       # you don't want the user to click a
                       # button to initiate install, but don't
                       # want to bug them every site visit if
                       # they chose not to install the app.
  success: ->
    alert "Thanks for installing my app!"
  error: ->
    alert "There was an error; please contact support."
```

`install(manifestURL[, options])`

Display an install prompt, allowing the user to install this app to their
device. Takes an `options` argument, which is actually a hash of args:

* `numberOfPrompts`: number of times to prompt the user to install the
                     app. If undefined or a non-truthy value, it will
                     ignored and app install will only be attempted
                     once. Defaults to `undefined`.
* `onlyPromptOnce`:  only prompt the user for install once. Useful if you
                     display a prompt on page load rather than when a user
                     taps a button in your app. Defaults to `false`.
* `success`:         success callback, run if the user accepts the install and
                     it takes place with no errors. The first argument passed
                     to the callback is the [App object](app), while the
                     second is the [DOMRequest object](domreq).
* `error`:           error callback, run if the user accepts the install, but
                     it fails. The first argument passed to the callback is
                     the [error object](error), while the second is the
                     [DOMRequest object](domreq).

[app]: https://developer.mozilla.org/en-US/docs/Web/API/App
[domreq]: https://developer.mozilla.org/en-US/docs/Web/API/DOMRequest
[error]: https://developer.mozilla.org/en-US/docs/Web/API/Apps.install#Error

<aside class="notice">You can call `install()` on a page that already has this
web app installed. `install()` checks to see if the app you're trying to
install is already available on the user's device. If it is already installed,
no code will be run.</aside>
