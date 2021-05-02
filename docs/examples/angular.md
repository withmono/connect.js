## Link account
Link a user account
```js
import { Component, OnInit } from '@angular/core';
import MonoConnect from '@mono.co/connect.js';

@Component({
  selector: 'app-mono',
  templateUrl: './mono.component.html',
  styleUrls: ['./mono.component.css']
})
export class MonoComponent implements OnInit {
  public monoInstance: any;

  constructor() {
    this.monoInstance = new MonoConnect({
      key: "PUBLIC_KEY", 
      onClose: () => console.log('Widget closed'),
      onLoad: () => console.log('Widget loaded successfully'),
      onSuccess: ({ code }) => console.log(`Linked successfully: ${code}`)
    })

    this.monoInstance.setup()
  }

  ngOnInit() {}
 }
```

```html
<!--mono.component.html-->
<button (click)="monoInstance.open()">
  Link your account
</button>
```

## Reauthorisation 

You can reauthorise a user acount if required. Using the `reauthorise()` function. 

- Note, the `reauthorise()` function should be used in place of the `setup()` function. The two should not be used at the same time.

See example below;
```js
import { Component, OnInit } from '@angular/core';
import MonoConnect from '@mono.co/connect.js';

@Component({
  selector: 'app-mono',
  templateUrl: './mono.component.html',
  styleUrls: ['./mono.component.css']
})
export class MonoComponent implements OnInit {
  public monoInstance: any;

  constructor() {
    this.monoInstance = new MonoConnect({
      key: "PUBLIC_KEY", 
      onSuccess: ({ code }) => console.log(`Reauth successful: ${code}`)
    })

    this.monoInstance.reauthorise("auth_vb6klH234ox")
  }

  ngOnInit() {}
 }
```

```html
<!--mono.component.html-->
<button (click)="monoInstance.open()">
  Reauthorise account
</button>
```

## Direct Debit
Charge an account `one-time-debit` or `recurring`.
```js
import { Component, OnInit } from '@angular/core';
import MonoConnect from '@mono.co/connect.js';

@Component({
  selector: 'app-mono',
  templateUrl: './mono.component.html',
  styleUrls: ['./mono.component.css']
})
export class MonoComponent implements OnInit {
  public monoInstance: any;

  constructor() {
    this.monoInstance = new MonoConnect({
      key: "PUBLIC_KEY", 
      scope: "payments",
      data: {
        type: 'one-time-debit', // recurring-debit or one-time-debit
        amount: 150000, //amount in kobo
        description: "payment for light bill"
      },
      onSuccess: (chargeObject) => console.log(`Payment successful`, chargeObject)
    })

    this.monoInstance.setup()
  }

  ngOnInit() {}
 }
```

```html
<!--mono.component.html-->
<button (click)="monoInstance.open()">
  Pay with Mono
</button>
```