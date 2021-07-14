"use strict";

var utils = require("./utils");
const axios = require('axios').default

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
  onEvent = anonFunc,
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

  if(!(this instanceof connect)) return new connect({
    key,
    onClose,
    onSuccess,
    onLoad,
    onEvent,
    ...rest
  });

  this.key = key || isRequired("PUBLIC_KEY");
  this.config = {...rest};
  connect.prototype.onLoad = onLoad;
  connect.prototype.onClose = onClose;
  connect.prototype.onSuccess = onSuccess || isRequired("onSuccess callback");
  connect.prototype.onEvent = onEvent;

  connect.prototype.utils = utils();
}

/**this is the entry function to setup the connect widget */
connect.prototype.setup = function (setup_configuration = {}) {
  connect.prototype.utils.addStyle();
  
  const qs = {...this.config, ...setup_configuration}

  connect.prototype.utils.init({
    key: this.key,
    qs: qs,
    onload: this.onLoad,
    onevent: this.onEvent,
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
    onevent: this.onEvent
  });
}

/**connect object property to open widget/modal */
connect.prototype.open = function () {
  connect.prototype.utils.openWidget();

  function handleEvents(event){

    switch(event.data.type) {
      /* Old callbacks */
      case "mono.connect.widget.account_linked":
        this.onSuccess({...event.data.data});
        this.onEvent('SUCCESS', event.data.data);
        connect.prototype.close(); // close widget on success
        break;
      case "mono.connect.widget.closed":
        connect.prototype.close();
        break;
      /* New onEvent callbacks */
      /* LOADED event is not triggered here, look in utils.js */
      case "mono.connect.widget_opened":
        this.onEvent('OPENED', event.data.data);
        break;
      case "mono.connect.error_occured":
        this.onEvent('ERROR', event.data.data);
        break;
      case "mono.connect.institution_selected":
        this.onEvent('INSTITUTION_SELECTED', event.data.data);
        break;
      case "mono.connect.auth_method_switched":
        this.onEvent('AUTH_METHOD_SWITCHED', event.data.data);
        break;
      case "mono.connect.on_exit":
        this.onEvent('EXIT', event.data.data);
        break;
      case "mono.connect.login_attempt":
        this.onEvent('SUBMIT_CREDENTIALS', event.data.data);
        break;
      case "mono.connect.mfa_submitted":
        this.onEvent('SUBMIT_MFA', event.data.data);
        break;
      case "mono.connect.account_linked":
        this.onEvent('ACCOUNT_LINKED', event.data.data);
        break;
      case "mono.connect.account_selected":
        this.onEvent('ACCOUNT_SELECTED', event.data.data);
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

/* provided helper functions */
connect.prototype.fetchInstitutions = function () {

  const url = "https://api.withmono.com/coverage"

  return axios.get(url)

}

// Do not attach connect to window when imported server side.
// This makes the module safe to import in an isomorphic code base.
if(typeof window !== "undefined") {
  window.Connect = connect;
}

module.exports = connect;
