"use strict";

var utils = require("./utils");
const anonFunc = () => {};
const isRequired = (name) => { throw new Error(`${name} is required`); };

/**
 * This function creates a connect object and returns it's properties
 * @param {*} key public key gotten from Mono dashboard - REQUIRED
 * @param {*} options optional params functions the be invoked on success, on load and on close
 */
function connect({
  key,
  onClose = anonFunc, 
  onSuccess, 
  onLoad = anonFunc,
  ...rest
}) {
  if(typeof arguments[0] !== "object"){
    //DEPRECATION warning
    console.warn(`DEPRECATED: MONO CONNECT EXPECTED 1 ARGUMENT, BUT GOT ${arguments.length}`);

    key = arguments[0] || isRequired("PUBLIC_KEY");
    onClose = arguments[1].onClose || anonFunc;
    onSuccess = arguments[1].onSuccess || isRequired("onSuccess callback");
    onLoad = arguments[1].onLoad || anonFunc;
    rest = {};
  }

  if(!(this instanceof connect)) return new connect({key, onClose, onSuccess, onLoad, ...rest});

  this.key = key || isRequired("PUBLIC_KEY");
  this.config = {...rest};
  connect.prototype.onLoad = onLoad;
  connect.prototype.onClose = onClose;
  connect.prototype.onSuccess = onSuccess || isRequired("onSuccess callback");
  connect.prototype.utils = utils();
}

/**this is the entry function to setup the connect widget */
connect.prototype.setup = function () {
  connect.prototype.utils.addStyle();

  connect.prototype.utils.init({
    key: this.key, 
    qs: this.config,
    onload: this.onLoad
  });
}

connect.prototype.reauthorise = function (reauth_token) {
  if(!reauth_token) {
    throw new Error("Re-auth token is required for reauthorisation");
  }

  connect.prototype.utils.addStyle();
  connect.prototype.utils.init({
    key: this.key, 
    qs: {...this.config, reauth_token},
    onload: this.onLoad,
  });
}

/**connect object property to open widget/modal */
connect.prototype.open = function () {
  connect.prototype.utils.openWidget();

  function handleEvents(event){
    switch(event.data.type) {
      case "mono.connect.widget.account_linked":
        this.onSuccess({...event.data.data});
        connect.prototype.close(); // close widget on success
        break;
      case "mono.connect.widget.closed":
        connect.prototype.close();
        break;
    }
  }

  connect.prototype.eventHandler = handleEvents.bind(this);
  window.addEventListener("message", this.eventHandler, false);
}

/**connect object property to hide modal and clean up to avoid leak */
connect.prototype.close = function () {
  window.removeEventListener("message", this.eventHandler, false);
  connect.prototype.utils.closeWidget();
  this.onClose();
}

window.Connect = connect; // make connect available globally

module.exports = connect;