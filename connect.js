"use strict";

var utils = require("./utils");
const axios = require('axios').default

const anonFunc = () => {};
const isRequired = (name) => { throw new Error(`${name} is required`); };

// The only origin whose "message" events are trusted.
const WIDGET_ORIGIN = "https://connect.mono.co";

// Events that carry user-entered credentials (bank logins, MFA codes) must
// not be relayed to the host app. Forward only documented, non-sensitive
// metadata.
const safeEventMeta = (data) => {
  const d = (data && typeof data === "object") ? data : {};
  const meta = {};
  if (d.reference !== undefined) meta.reference = d.reference;
  if (d.timestamp !== undefined) meta.timestamp = d.timestamp;
  if (d.mfaType !== undefined) meta.mfaType = d.mfaType;
  return meta;
};

/**
 * This function creates a connect object and returns it's properties
 * @param {*} key public key gotten from Mono dashboard - REQUIRED
 * @param {*} options optional params functions to be invoked on success, on load and on close
 */
function connect({
  key,
  onClose = anonFunc,
  onSuccess,
  onLoad = anonFunc,
  onEvent = anonFunc,
  ...rest
}) {
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

connect.prototype.reauthorise = function (accountId) {
  if(!accountId) {
    throw new Error("Account ID is required for re-authorisation");
  }

  if (typeof accountId !== "string") {
    throw new Error("Invalid accountId: must be a string");
  }

  connect.prototype.utils.addStyle();
  connect.prototype.utils.init({
    key: this.key,
    qs: {
      ...this.config,
      data: {
        ...(this.config.data || {}),
        account: accountId,
      },
    },
    onload: this.onLoad,
    onevent: this.onEvent
  });
}

/**connect object property to open widget/modal */
connect.prototype.open = function () {
  connect.prototype.utils.openWidget();

  function handleEvents(event){
    // Trust only messages from the Connect widget's origin. Messages
    // dispatched by other scripts or iframes on the host page (or
    // postMessage'd from anywhere else) are ignored.
    if (event.origin !== WIDGET_ORIGIN) return;
    if (!event.data || typeof event.data !== "object") return;

    switch(event.data.type) {
      /* Old callbacks */
      case "mono.connect.widget.charge_complete":
      case "mono.connect.widget.account_linked":
        this.onSuccess({...event.data.data});
        this.onEvent('SUCCESS', event.data.data);
        break;
      case "mono.connect.widget.closed":
        this.close();
        break;
      /* New onEvent callbacks */
      /* LOADED and OPENED events are not triggered here, look in utils.js */
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
        this.onEvent('SUBMIT_CREDENTIALS', safeEventMeta(event.data.data));
        break;
      case "mono.connect.mfa_submitted":
        this.onEvent('SUBMIT_MFA', safeEventMeta(event.data.data));
        break;
      case "mono.connect.account_linked":
        this.onEvent('ACCOUNT_LINKED', event.data.data);
        break;
      case "mono.connect.account_selected":
        this.onEvent('ACCOUNT_SELECTED', event.data.data);
        break;
    }
  }

  // Keep the handler on the instance (not the prototype) so each instance
  // owns its listener, and re-opening does not stack duplicate listeners.
  if (this.eventHandler) {
    window.removeEventListener("message", this.eventHandler, false);
  }
  this.eventHandler = handleEvents.bind(this);
  window.addEventListener("message", this.eventHandler, false);
}

/**connect object property to hide modal and clean up to avoid leak */
connect.prototype.close = function () {
  if (this.eventHandler) {
    window.removeEventListener("message", this.eventHandler, false);
    this.eventHandler = null;
  }
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
