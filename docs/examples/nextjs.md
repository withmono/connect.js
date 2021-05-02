## Link account
Link a user account
```js
import { useState, useCallback } from "react";

export default function IndexPage() {
  const [scriptLoaded, setScriptLoaded] = useState(false);

  const openMonoWidget = useCallback(async () => {
    const MonoConnect = (await import("@mono.co/connect.js")).default;
    
    const monoInstance = new MonoConnect({
      key: "PUBLIC_KEY",
      onClose: () => console.log("Widget closed"),
      onLoad: () => setScriptLoaded(true),
      onSuccess: ({ code }) => console.log(`Linked successfully: ${code}`),
    });

    monoInstance.setup();
    monoInstance.open();
  }, []);

  return (
    <div>
      Hello World. Try Mono connect with next.js
      <div style={{ marginTop: "10px" }}>
        <button onClick={() => openMonoWidget()}>
          Link a financial account
        </button>
      </div>
    </div>
  );
}
```

## Reauthorisation 

You can reauthorise a user acount if required. Using the `reauthorise()` function. 

- Note, the `reauthorise()` function should be used in place of the `setup()` function. The two should not be used at the same time.

See example below;
```js
import { useState, useCallback } from "react";

export default function IndexPage() {
  const [reauthCode, setReauthCode] = useState("reauth_toKeN");
  const [scriptLoaded, setScriptLoaded] = useState(false);

  const reauthenticate = useCallback(async () => {
    const MonoConnect = (await import("@mono.co/connect.js")).default;

    const monoInstance = new MonoConnect({
      key: "PUBLIC_KEY",
      onClose: () => console.log("Widget closed"),
      onLoad: () => setScriptLoaded(true),
      onSuccess: ({ code }) => console.log(`Reauth successful: ${code}`),
    });

    monoInstance.reauthorise(reauthCode);
    monoInstance.open();
  }, []);

  return (
    <div>
      Hello World. Try Mono connect with next.js
      <div style={{ marginTop: "10px" }}>
        <button onClick={() => reauthenticate()}>
          Reauthenticate your account
        </button>
      </div>
    </div>
  );
}
```

## Direct Debit
Charge an account `one-time-debit` or `recurring`.
```js
import { useState, useCallback } from "react";

export default function IndexPage() {
  const [scriptLoaded, setScriptLoaded] = useState(false);

  const payWithMono = useCallback(async () => {
    const MonoConnect = (await import("@mono.co/connect.js")).default;
    
    const monoInstance = new MonoConnect({
      key: "PUBLIC_KEY",
      scope: "payments",
      data: {
        type: "one-time-debit", // recurring-debit or one-time-debit
        amount: 150000, // amount in kobo
        description: "Payment for light bill"
      },
      onSuccess: ({ code }) => console.log(`Linked successfully: ${code}`),
    });

    monoInstance.setup();
    monoInstance.open();
  }, []);

  return (
    <div>
      Hello World. Try Mono connect with next.js
      <div style={{ marginTop: "10px" }}>
        <button onClick={() => payWithMono()}>
          Pay with Mono
        </button>
      </div>
    </div>
  );
}
```

> NOTE 🚨  
> Next.js as an SSR or SSG framework means the code is rendered on the server first, hence DOM manipulation isn't possible until the code is rendered on the browser. If you want to change the approach used in the examples below make sure you are checking if the window property is available before creating an instance of the widget.