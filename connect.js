"use strict";

var utils = require("./utils");
const anonFunc = () => {};

/**
 * This function creates a connect object and returns it's properties
 * @param {*} key public key gotten from Mono dashboard - REQUIRED
 * @param {*} options optional params functions the be invoked on success, on load and on close
 */
function connect(key, {
  onClose = anonFunc, 
  onSuccess = anonFunc, 
  onLoad = anonFunc
}) {
  if(!(this instanceof connect)) return new connect(key, {onClose, onSuccess});

  if (!key) throw new Error('YOUR MONO PUBLIC KEY IS REQUIRED');

  this.key = key;
  connect.prototype.onLoad = onLoad;
  connect.prototype.onClose = onClose;
  connect.prototype.onSuccess = onSuccess;
  connect.prototype.utils = utils();
}

/**this is the entry function to setup the connect widget */
connect.prototype.setup = function () {
  connect.prototype.utils.addStyle();
  connect.prototype.utils.init(this.key, this.onLoad);

  window.addEventListener("message", (event) => {
    switch(event.data.type) {
      case "mono.modal.closed":
        connect.prototype.close();
        break;
      case "mono.modal.linked":
        this.onSuccess({...event.data.response});
        break;
    }
  })
}

/**connect object property to open widget/modal */
connect.prototype.open = function () {
  connect.prototype.utils.openWidget();
}

/**connect object property to hide modal and clean up to avoid leak */
connect.prototype.close = function () {
  window.removeEventListener("message", () => {});
  connect.prototype.utils.closeWidget();
  this.onClose();
}

window.connect = connect; // make connect available globally

module.exports = connect;