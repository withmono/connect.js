
# Mono Connect.js

Mono Connect.js is a quick and secure way to link bank accounts to Mono from within your app. Mono Connect is a drop-in framework that handles connecting a financial institution to your app (credential validation, multi-factor authentication, error handling, etc). It works with all major javascript frameworks.

For accessing customer accounts and interacting with Mono's API (Identity, Transactions, Income, TransferPay) use the server-side [Mono API](https://docs.mono.co/docs/intro-to-mono-api).

## Documentation

For complete information about Mono Connect, head to the [docs](https://docs.mono.co/docs/intro-to-mono-connect-widget).


## Getting Started

1. Register on the [Mono](https://app.withmono.com/dashboard) website and get your public and secret keys.
2. Setup a server to [exchange tokens](https://docs.mono.co/reference/authentication-endpoint) to access user financial data with your Mono secret key.


## Installation

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
- [`key`](#key)
- [`onSuccess`](#onSuccess)
- [`onClose`](#onClose)
- [`onLoad`](#onLoad)
- [`onEvent`](#onEvent)

### <a name="key"></a> `key`
**Required**  
This is your Mono public API key from the [Mono dashboard](https://app.withmono.com/apps).
```js
  new Connect({ key: 'mono_public_key' });
```

### <a name="onSuccess"></a> `onSuccess`      
**Required**
This function is called when a user has successfully onboarded their account. It should take a single String argument containing the token that can be [exchanged for an account id](https://docs.mono.co/reference/authentication-endpoint).
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

### <a name="onClose"></a> `onClose`
The optional closure is called when a user has specifically exited the Mono Connect flow (i.e. the widget is not visible to the user). It does not take any arguments.
```js
  new Connect({
    key: 'mono_public_key',
    onSuccess: ({code}) => console.log("auth code", code),
    onClose: () => console.log("widget has been closed")
  });
```

### <a name="onLoad"></a> `onLoad`
This function is invoked the widget has been mounted unto the DOM. You can handle toggling your trigger button within this callback.
```js
  new Connect({
    key: 'mono_public_key',
    onSuccess: ({code}) => console.log("auth code", code),
    onLoad: () => console.log("widget loaded successfully")
  });
```

### <a name="onEvent"></a> `onEvent`
This optional function is called when certain events in the Mono Connect flow have occurred, for example, when the user selected an institution. This enables your application to gain further insight into the Mono Connect onboarding flow.

See the [data](#dataObject) object below for details.

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
    onLoad: () => console.log("widget loaded successfully"),
    onClose: () => console.log("widget has been closed"),
	onEvent: (eventName, data) => {console.log(eventName); console.log(data)},
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

### <a name="onEventCallback"></a> onEvent Callback

The onEvent callback returns two paramters, [eventName](#eventName) a string containing the event name and [data](#dataObject) an object that contains event metadata.

```js
const connect = new Connect({
  key: 'mono_public_key',
  onSuccess: ({code}) => console.log("code", code),
  onEvent: (eventName, data) => {
    console.log(eventName)
    console.log(data)
  }
});

```

#### <a name="eventName"></a> `eventName`

Event names corespond to the `type` key returned by the raw event data. Possible options are in the table below.

| Raw Event Type | eventName |
| ----------- | ----------- |
| `mono.connect.widget_opened` | OPENED |
| `mono.connect.on_exit` | EXIT |
| `mono.connect.institution_selected` | INSTITUTION_SELECTED |
| `mono.connect.auth_method_switched` | AUTH_METHOD_SWITCHED |
| `mono.connect.login_attempt` | SUBMIT_CREDENTIALS |
| `mono.connect.account_linked` | ACCOUNT_LINKED |
| `mono.connect.account_selected` | ACCOUNT_SELECTED |
| `mono.connect.error_occured` | ERROR |


#### <a name="dataObject"></a> `data`
The data object returned from the onEvent callback.

```js
{
	"reference": "ref_code_passed", // emitted in all events
	"errorType": "ERORR_NAME", // emitted in ERROR
	"errorMessage": "An error occurred.", // emitted in ERORR
	"mfaType": "OTP", // emitted in SUBMIT_MFA
	"prevAuthMethod": "internet_banking", // emitted in AUTH_METHOD_SWITCHED
	"authMethod": "mobile_banking", // emitted in AUTH_METHOD_SWITCHED and INSTITUTION_SELECTED
	"pageName": "MFA", // emitted in EXIT
	"selectedAccountsCount": 2 // emitted in ACCOUNT_SELECTED
	"institution": { // emitted in ACCOUNT_LINKED and INSTITUTION_SELECTED
	  "id": "66059eO033be88012",
	  "name": "GTBank"
	},   
	"timestamp": 1234567890 // emitted in all events
}
```


## Support
If you're having general trouble with Mono Connect iOS SDK or your Mono integration, please reach out to us at <hi@mono.co> or come chat with us on [Slack](https://join.slack.com/t/devwithmono/shared_invite/zt-gvkqczzk-Ldt4FQpHtOL7FFTqh4Ux6A). We're proud of our level of service, and we're more than happy to help you out with your integration to Mono.

## Contributing

If you find any issue using this package please let us know by filing an issue right [here](https://github.com/withmono/connect.js/issues).

If you would like to contribute to the Mono Connect iOS SDK, please make sure to read our [contributor guidelines](https://github.com/withmono/connect.js/tree/main/CONTRIBUTING.md).


## License

[MIT](https://github.com/withmono/connect.js/tree/main/LICENSE) for more information.
