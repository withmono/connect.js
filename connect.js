"use strict";

var utils = require("./utils");

function connect(key, {onClose = anonFunc, onSuccess = anonFunc}) {
  if(!(this instanceof connect)) return new connect(key, {onClose, onSuccess});

  if (!key) throw new Error('YOUR MONO PUBLIC KEY IS REQUIRED');

  this.key = key;
  connect.prototype.onClose = onClose;
  connect.prototype.onSuccess = onSuccess;
  connect.prototype.utils = utils();
}

connect.prototype.setup = function () {
  connect.prototype.utils.addStyle();
  connect.prototype.utils.init(this.key);

  window.addEventListener("message", (event) => {
    switch(event.data.type) {
      case "mono.modal.closed":
        connect.prototype.close();
        break;
      case "mono.modal.linked":
        this.onSuccess({...event.data.response})
        break;
    }
  })
}

connect.prototype.open = function () {
  connect.prototype.utils.openWidget()
}

connect.prototype.close = function () {
  window.removeEventListener("message", () => {})
  connect.prototype.utils.closeWidget();
  this.onClose();
}

window.connect = connect;