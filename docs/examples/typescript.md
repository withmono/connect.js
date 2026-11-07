## TypeScript with Next.js
This is the [Next.js example](nextjs.md) written in TypeScript. The package ships its own type definitions, so there is nothing extra to install. Your `tsconfig.json` needs `esModuleInterop` (on by default in Next.js and Vite projects).

```tsx
"use client";

import { useCallback, useState } from "react";
import type Connect from "@mono.co/connect.js";

export default function IndexPage() {
  const [widgetLoaded, setWidgetLoaded] = useState(false);

  const openMonoWidget = useCallback(async () => {
    // import on click: the widget needs the browser, so it cannot run while Next.js renders on the server
    const MonoConnect = (await import("@mono.co/connect.js")).default;

    const onEvent: Connect.Config["onEvent"] = (eventName, data) => {
      if (eventName === "INSTITUTION_SELECTED") {
        console.log("Selected institution:", data.institution?.name);
      }
    };

    const monoInstance = new MonoConnect({
      key: "PUBLIC_KEY",
      onLoad: () => setWidgetLoaded(true),
      onClose: () => console.log("Widget closed"),
      onEvent,
      onSuccess: ({ code }) => {
        // send `code` to your server and exchange it for an account id
        console.log(`Linked successfully: ${code}`);
      },
    });

    monoInstance.setup();
    monoInstance.open();
  }, []);

  return (
    <div>
      <button onClick={() => openMonoWidget()}>
        {widgetLoaded ? "Link another account" : "Link a financial account"}
      </button>
    </div>
  );
}
```

## Direct debit
Like the example above, the next two snippets must run in the browser, for example inside a click handler.

```ts
import MonoConnect from "@mono.co/connect.js";

const connect = new MonoConnect({
  key: "PUBLIC_KEY",
  scope: "payments",
  data: {
    type: "one-time-debit", // "recurring-debit" | "one-time-debit"
    amount: 150000, // amount in kobo
    description: "Payment for light bill",
  },
  // direct debit returns a charge object (amount, transaction_reference, type), not a `code`
  onSuccess: (charge) => console.log(charge.transaction_reference),
});
```

## Re-authorisation
```ts
import MonoConnect from "@mono.co/connect.js";

const connect = new MonoConnect({ key: "PUBLIC_KEY", onSuccess: ({ code }) => console.log(code) });
connect.reauthorise("account_xyz"); // use this instead of setup()
connect.open();
```
