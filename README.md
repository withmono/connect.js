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
import * as MonoConnect from '@mono.co/connect.js';

export default function App() {
  const monoConnect = React.useCallback(() => {
    return new connect("PUBLIC_KEY", {
      onClose: () => console.log('Widget closed'),
      onLoad: () => console.log('Widget loaded successfully'),
      onSuccess: ({ id }) => console.log(`Linked successfully: ${id}`)
    })
  })

  return (
    <div>
      <button onClick={() => monoConnect.open()}>
        Authenticate with Mono
      </button>
    </div>
  )
}
```

## Parameters
To create an instance of the connect object, you can pass the following parameters:

| Param              | Required    | Type        |
| ------------------ | ----------- | ----------- |
| key                | true        | string      |
| options: ```onClose: () => void```, ```onLoad: () => void```, ```onSuccess: ({ id }) => void```           | false       | object      |

## Connect object properties
The connect object returns some properties for you to interaction with the widget:

| Function        | Description |
| --------------- | ----------- |
| ```setup()```   | Adds the widget iframe to the DOM       |
| ```close()```   | Hides the widget       |
| ```open()```    | Makes the widget visible        |