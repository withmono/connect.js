# @mono.co/connect.js
Repository for connect.js, Mono connect widget script.

## Installation

```bash
yarn add @mono.co/connect.js
```
or
```bash
npm install @mono.co/connect.js
```

## Usage

```js
import React from 'react';
import MonoConnect from '@mono.co/connect.js';

export default function App() {
  const monoConnect = React.useMemo(() => {
    const monoInstance = new MonoConnect({
      onClose: () => console.log('Widget closed'),
      onLoad: () => console.log('Widget loaded successfully'),
      onSuccess: ({ code }) => console.log(`Linked successfully: ${code}`),
      key: "PUBLIC_KEY",
    })

    monoInstance.setup()
    
    return monoInstance;
  }, [])

  return (
    <div>
      <button onClick={() => monoConnect.open()}>
        Authenticate with Mono
      </button>
    </div>
  )
}
```

Reauthorisation, you can reauthorise user acount if reauired. Using the `reauthorise()` function. See example below.
```js
import React from 'react';
import MonoConnect from '@mono.co/connect.js';

export default function App() {
  const monoConnect = React.useMemo(() => {
    const monoInstance = new MonoConnect({
      onClose: () => console.log('Widget closed'),
      onLoad: () => console.log('Widget loaded successfully'),
      onSuccess: ({ code }) => console.log(`Linked successfully: ${code}`),
      key: "PUBLIC_KEY",
    })

    monoInstance.setup()
    
    return monoInstance;
  }, [])

  const reauth_token = "code_xyzUi8olavk";

  return (
    <div>
      <button onClick={() => monoConnect.reauthorise(reauth_token)}>
        Reauthorise user account
      </button>
    </div>
  )
}
```

> 🔔 DEPRECATION NOTICE  
> The old Mono connect constructor which takes two arguments; i.e the public key and an object of callbacks has now been deprecated. 

## Parameters
To create an instance of the connect object, you can pass the following parameters:

| Param              | Required    | Type        |
| ------------------ | ----------- | ----------- |
| key                | true        | string      |
| onClose            | false       | () => void      |
| onSuccess          | true       | ({ code }) => void      |
| onLoad           | false       | () => void      |

## Connect object properties
The connect object returns some properties for you to be able interact with the widget:

| Function        | Description |
| --------------- | ----------- |
| ```setup()```   | Adds the widget iframe to the DOM       |
| ```close()```   | Hides the widget       |
| ```open()```    | Makes the widget visible        |
| ```reauthorise(re_auth_token: stirng)```    | Allows reathentication of user, a reauth token is required       |