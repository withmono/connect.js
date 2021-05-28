
# @mono.co/connect.js

connect.js is a javascript package that allows you to load the Mono connect widget in your app. It works across all major javascript frameworks.


## Getting started 

Before you begin, grab you API keys from Mono dashboard. You are required to have an account with Mono.

Request for you API keys [here](https://app.withmono.com/register)

### Installation

You can install the package using NPM or Yarn;

```bash 
  npm install @mono.co/connect.js
```
or
```bash 
  yarn add @mono.co/connect.js
```
    
## Usage
Click the links below for detailed examples on how to use connect.js with your favourite framework;
- [React](docs/examples/react.md)
- [Angular](docs/examples/angular.md)
- [Next.js](docs/examples/nextjs.md)

> NOTE  
> The list above is not exhaustive, you can use this package in other frontend javascript frameworks.
## Parameters
- [`key`](README.md#key)
- [`onSuccess`](README.md#onsuccess)
- [`onClose`](README.md#onclose)
- [`onLoad`](README.md#onload)

### `key` 
**Required**  
This is your Mono public API key gotten from the Mono [dashboard](https://app.withmono.com)
```js
  new Connect({ key: 'mono_public_key' });
```

### `onSuccess`      
**Required**


This is a callback function invoked when authentication or payment is successful.
```js
  new Connect({ 
    key: 'mono_public_key',
    onSuccess: (data) => {
      // in the case of authentication auth code is returned
      console.log("auth code", data.code);
      // in the case of direct debit payments
      // a charge object is return containing amount, transaction_reference, type...
      console.log("charge object", data);
    } 
  });
```
Auth code returned after successful authentication is exchanged for customer account ID like explained in the [docs](https://docs.mono.co/reference/authentication-endpoint)

### `onClose`
This function is invoked when the widget is closed i.e not visible to the user.
```js
  new Connect({ 
    key: 'mono_public_key',
    onSuccess: ({code}) => console.log("auth code", code),
    onClose: () => console.log("widget has been closed")
  });
```

### `onLoad`
This function is invoked the widget has been mounted unto the DOM. You can handle toggling your trigger button within this callback. 
```js
  new Connect({ 
    key: 'mono_public_key',
    onSuccess: ({code}) => console.log("auth code", code),
    onLoad: () => console.log("widget loaded successfully")
  });
```

### `onEvent`
This function is invoked when the widget state changes. You can handle toggling your trigger button within this callback. 
```js
  new Connect({ 
    key: 'mono_public_key',
    onSuccess: ({code}) => console.log("auth code", code),
    onEvent: (eventName, metadata) => { console.log(eventName); console.log(metadata) }
  });
```

## API Reference

### `setup()`
This method is used to load the widget unto the DOM, the widget remains hidden after invoking this function until the `open()` method is called.
```js
  const connect = new Connect({
    key: 'mono_public_key',
    onSuccess: ({code}) => console.log("code", code),
  });
  connect.setup();
```

### `reauthorise(reauth_code: string)`
This methods loads the reauth widget unto the DOM, the widget remains hidden after invoking this function until the `open()` method is called.   

Reauthorisation of already authenticated accounts is done when MFA (Multi Factor Authentication) or 2FA is required by the institution or it has been setup by the user for security purposes before more data can be fetched from the account.

Check Mono [docs](https://docs.mono.co/reference/intro#reauth-code) on how to obtain `reauth_code` of an account.

```js
  const connect = new Connect({
    key: 'mono_public_key',
    onSuccess: ({code}) => console.log("code", code),
  });
  connect.reauthorise("auth_fb8PP3jYA0");
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `reauth_code`      | `string` | **Required**. Reauth code of the account to be reauthorised |

> NOTE  
> the `reauthorise` method and `setup` method should be used separately. When used together, the last called method takes precedence.

### `open()`
This method makes the widget visible to the user.
```js
  const connect = new Connect({
    key: 'mono_public_key',
    onSuccess: ({code}) => console.log("code", code),
  });
  
  connect.setup();
  connect.open();
```

### `close()`
This method programatically hides the widget after it's been opened.
```js
  const connect = new Connect({
    key: 'mono_public_key',
    onSuccess: ({code}) => console.log("code", code),
  });
  
  connect.setup();
  connect.open();
  // this closes the widget 5seconds after it has been opened
  setTimeout(() => connect.close(), 5000)
```

If you find any issue using this package please let us know by filing an issue right [here](https://github.com/withmono/connect.js/issues)