## Link account
Link a user account
```js
import React from 'react';
import MonoConnect from '@mono.co/connect.js';

export default function App() {
  const monoConnect = React.useMemo(() => {
    const monoInstance = new MonoConnect({
      onClose: () => console.log('Widget closed'),
      onLoad: () => console.log('Widget loaded successfully'),
      onSuccess: ({ code }) => console.log(`Linked successfully: ${code}`),
      key: "PUBLIC_KEY"
    })

    monoInstance.setup()
    
    return monoInstance;
  }, [])

  return (
    <div>
      <button onClick={() => monoConnect.open()}>
        Link account with Mono
      </button>
    </div>
  )
}
```

## Reauthorisation 

You can reauthorise a user acount if required. Using the `reauthorise()` function. 

- Note, the `reauthorise()` function should be used in place of the `setup()` function. The two should not be used at the same time.

See example below;
```js
import React from 'react';
import MonoConnect from '@mono.co/connect.js';

export default function App() {

  const monoConnect = React.useMemo(() => {
    const monoInstance = new MonoConnect({
      key: "PUBLIC_KEY",
      onSuccess: ({ code }) => console.log(`Linked successfully: ${code}`),
    })
    
    return monoInstance;
  }, [])

  function reauthoriseAccount() {
    const reauth_token = "code_xyzUi8olavk";
    monoConnect.reauthorise(reauth_token);
    monoConnect.open();
  }

  return (
    <div>
      <button onClick={() => reauthoriseAccount()}>
        Reauthorise user account
      </button>
    </div>
  )
}
```

## Direct Debit
Charge an account `one-time-debit` or `recurring`.
```js
import React from 'react';
import MonoConnect from '@mono.co/connect.js';

export default function App() {
  const monoConnect = React.useMemo(() => {
    const monoInstance = new MonoConnect({
      key: "PUBLIC_KEY",
      scope: "payments",
      data: {
        type: "one-time-debit", // one-time-debit || recurring-debit
        amount: 150000, // amount in kobo
        description: "Payment for light bill",
      },
      onSuccess: (chargeObject) => console.log(`charged successfully`, chargeObject),
    })

    monoInstance.setup()
    
    return monoInstance;
  }, [])

  return (
    <div>
      <button onClick={() => monoConnect.open()}>
        Pay with Mono
      </button>
    </div>
  )
}
```