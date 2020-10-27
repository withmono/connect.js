# @mono.co/connect.js
Repository for connect.js, Mono connect widget script.

Request access [here](https://app.withmono.com/register) to get your API keys



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
    const monoInstance = new MonoConnect("PUBLIC_KEY", {
      onClose: () => console.log('Widget closed'),
      onLoad: () => console.log('Widget loaded successfully'),
      onSuccess: ({ code }) => console.log(`Linked successfully: ${code}`)
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



On Nextjs, make the above code a reusable component and dynamically import it where ever you need it 


*components/MonoButton.js* 
```js
import React from 'react';
import MonoConnect from '@mono.co/connect.js';

export default function MonoButton() {
  const monoConnect = React.useMemo(() => {
    const monoInstance = new MonoConnect("PUBLIC_KEY", {
      onClose: () => console.log('Widget closed'),
      onLoad: () => console.log('Widget loaded successfully'),
      onSuccess: ({ code }) => console.log(`Linked successfully: ${code}`)
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
import it where you want to use it (notice the { ssr: false } - we want to only render this on client side)

*pages/bank.js* 
```js
import React from 'react';
import dynamic from "next/dynamic";
const MonoButton = dynamic(() => import("../components/MonoButton.js"), {
  ssr: false,
});

export default function bank() {
  

  return (
    <div>
      <MonoButton />
    </div>
  )
}
```




## Parameters
To create an instance of the connect object, you can pass the following parameters:

| Param              | Required    | Type        |
| ------------------ | ----------- | ----------- |
| key                | true        | string      |
| options: ```onClose: () => void```, ```onLoad: () => void```, ```onSuccess: ({ code }) => void```           | false       | object      |

## Connect object properties
The connect object returns some properties for you to be able interact with the widget:

| Function        | Description |
| --------------- | ----------- |
| ```setup()```   | Adds the widget iframe to the DOM       |
| ```close()```   | Hides the widget       |
| ```open()```    | Makes the widget visible        |
