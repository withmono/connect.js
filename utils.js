"use strict";

const anonFunc = () => {};

var utils = () => {
  
    function init(key) {
        var widget_div = document.createElement("div");
        widget_div.setAttribute("id", "mono-connect--widget-div");
        widget_div.setAttribute("style", containerStyle);
        document.body.parentNode.insertBefore(widget_div, document.body.nextSibling);

        var iframe = document.createElement("IFRAME");
        iframe.setAttribute("src", `https://connect.withmono.com/?key=${key}`);
        iframe.setAttribute("style", iframeStyle);
        iframe.setAttribute("id", "mono-connect--frame-id")
        iframe.setAttribute("allowfullscreen", "true");
        iframe.setAttribute("frameborder", 0);
        iframe.setAttribute("sandbox", "allow-forms allow-scripts allow-same-origin allow-top-navigation-by-user-activation");
        iframe.onload = function() {
          var loader = document.getElementById("mono-connect-app-loader");
          loader.style.display = "none";
        }

        var loader = createLoader()
        document.getElementById('mono-connect--widget-div').appendChild(loader)
        document.getElementById('mono-connect--widget-div').appendChild(iframe);
    }
    
    function openWidget() {
        var container = document.getElementById("mono-connect--widget-div");
        var frame = document.getElementById("mono-connect--frame-id");
        container.style.visibility = "visible";
        setTimeout(() => {
            frame.style.visibility = "visible";
        }, 2000)
    }

    function closeWidget() {
        var parentWindow = window.parent;
        var body = parentWindow.document.body;
        var remove = body.removeChild(body.childNodes[0]);
    }

    function createLoader() {
        let loaderDiv = document.createElement("div");
        let childDiv = document.createElement("div");
        loaderDiv.setAttribute("id", "mono-connect-app-loader")
        loaderDiv.classList.add("app-loader");
        childDiv.classList.add("app-loader__spinner");

        for(let i =0; i < 12; i++){
          let div = document.createElement("div");
          childDiv.appendChild(div);
        }
        loaderDiv.appendChild(childDiv);
        return loaderDiv;
    }

    function addStyle() {
        var styleSheet = document.createElement("style")
        styleSheet.type = "text/css"
        styleSheet.innerText = loaderStyles;
        document.head.appendChild(styleSheet);
    }

    return {
        openWidget: openWidget,
        closeWidget: closeWidget,
        createLoader: createLoader,
        addStyle: addStyle,
        init
    }
}

module.exports = utils

const containerStyle = "position:fixed;overflow: hidden;display: flex;justify-content: center;align-items: center;z-index: 999999999;height: 100%;width: 100%;color: transparent;background: rgba(0, 0, 0, 0.6);visibility:hidden;margin: 0;top:0;right:0;bottom:0;left:0;";
const iframeStyle = "position: fixed;overflow: hidden;z-index: 999999999;width: 100%;height: 100%;transition: opacity 0.3s ease 0s;visibility:hidden;margin: 0;top:0;right:0;bottom:0;left:0;";
const loaderStyles = `.app-loader {
  text-align: center;
  color: white;
}

@-webkit-keyframes app-loader__spinner {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

.app-loader__spinner {
  position: relative;
  display: inline-block;
}

.app-loader__spinner div {
  position: absolute;
  -webkit-animation: app-loader__spinner linear 1s infinite;
  animation: app-loader__spinner linear 1s infinite;
  background: white;
  width: 10px;
  height: 30px;
  border-radius: 40%;
  -webkit-transform-origin: 5px 65px;
  transform-origin: 5px 65px;
}

.app-loader__spinner div:nth-child(1) {
  -webkit-transform: rotate(0deg);
  transform: rotate(0deg);
  -webkit-animation-delay: -0.916666666666667s;
  animation-delay: -0.916666666666667s;
}

.app-loader__spinner div:nth-child(2) {
  -webkit-transform: rotate(30deg);
  transform: rotate(30deg);
  -webkit-animation-delay: -0.833333333333333s;
  animation-delay: -0.833333333333333s;
}

.app-loader__spinner div:nth-child(3) {
  -webkit-transform: rotate(60deg);
  transform: rotate(60deg);
  -webkit-animation-delay: -0.75s;
  animation-delay: -0.75s;
}

.app-loader__spinner div:nth-child(4) {
  -webkit-transform: rotate(90deg);
  transform: rotate(90deg);
  -webkit-animation-delay: -0.666666666666667s;
  animation-delay: -0.666666666666667s;
}

.app-loader__spinner div:nth-child(5) {
  -webkit-transform: rotate(120deg);
  transform: rotate(120deg);
  -webkit-animation-delay: -0.583333333333333s;
  animation-delay: -0.583333333333333s;
}

.app-loader__spinner div:nth-child(6) {
  -webkit-transform: rotate(150deg);
  transform: rotate(150deg);
  -webkit-animation-delay: -0.5s;
  animation-delay: -0.5s;
}

.app-loader__spinner div:nth-child(7) {
  -webkit-transform: rotate(180deg);
  transform: rotate(180deg);
  -webkit-animation-delay: -0.416666666666667s;
  animation-delay: -0.416666666666667s;
}

.app-loader__spinner div:nth-child(8) {
  -webkit-transform: rotate(210deg);
  transform: rotate(210deg);
  -webkit-animation-delay: -0.333333333333333s;
  animation-delay: -0.333333333333333s;
}

.app-loader__spinner div:nth-child(9) {
  -webkit-transform: rotate(240deg);
  transform: rotate(240deg);
  -webkit-animation-delay: -0.25s;
  animation-delay: -0.25s;
}

.app-loader__spinner div:nth-child(10) {
  -webkit-transform: rotate(270deg);
  transform: rotate(270deg);
  -webkit-animation-delay: -0.166666666666667s;
  animation-delay: -0.166666666666667s;
}

.app-loader__spinner div:nth-child(11) {
  -webkit-transform: rotate(300deg);
  transform: rotate(300deg);
  -webkit-animation-delay: -0.083333333333333s;
  animation-delay: -0.083333333333333s;
}

.app-loader__spinner div:nth-child(12) {
  -webkit-transform: rotate(330deg);
  transform: rotate(330deg);
  -webkit-animation-delay: 0s;
  animation-delay: 0s;
}

.app-loader__spinner {
  width: 40px;
  height: 40px;
  -webkit-transform: translate(-20px, -20px) scale(0.2) translate(20px, 20px);
  transform: translate(-20px, -20px) scale(0.2) translate(20px, 20px);
}
`